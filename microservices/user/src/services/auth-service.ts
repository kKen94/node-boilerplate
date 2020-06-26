import { LoginRequestDto, LoginResponseDto, SignUpRequestDto } from '@dto';
import { Company, TokenVerification, User } from '@entity';
import {
  checkIfUnencryptedPasswordIsValid,
  checkRules,
  generateToken,
  getRandomAlphaNumeric,
  getRepo,
  hashPassword,
  sendEmail,
} from '@helper';
import {
  CompanyRepository,
  PermissionRepository,
  TokenVerificationRepository,
  UserRepository,
} from '@repository';
import { TokenExpiredError } from 'jsonwebtoken';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from 'routing-controllers';
import { injectable } from 'tsyringe';
import { normalizeDbDate } from '../helpers/date';

@injectable()
export class AuthService {
  private readonly userRepository = getRepo(UserRepository);
  private readonly permissionRepository = getRepo(PermissionRepository);
  private readonly companyRepository = getRepo(CompanyRepository);
  private readonly tokenVerificationRepository = getRepo(
    TokenVerificationRepository,
  );

  public async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    let user: User;
    try {
      user = await this.userRepository.findByEmailWithPermissions(
        loginDto.email,
      );
    } catch (error) {
      throw new NotFoundError(`User not found`);
    }

    if (user.deleted) {
      throw new NotFoundError(`User not found`);
    }

    if (
      !checkIfUnencryptedPasswordIsValid(loginDto.password, user.passwordHash)
    ) {
      throw new UnauthorizedError('Password wrong');
    }

    if (!user.emailConfirmed) {
      throw new Error('Email not confirmed');
    }

    const validateActiveDate =
      (normalizeDbDate(user.activeFrom) <= new Date() ||
        !normalizeDbDate(user.activeFrom)) &&
      (normalizeDbDate(user.activeTo) > new Date() ||
        !normalizeDbDate(user.activeTo));

    if (!validateActiveDate || !user.active) {
      throw new Error('User not active');
    }

    const resetPassword =
      (normalizeDbDate(user.passwordExpiration) &&
        normalizeDbDate(user.passwordExpiration) <= new Date()) ||
      user.forceResetPassword;

    if (resetPassword) {
      return new LoginResponseDto(null, null, null, true);
    }

    const token = await generateToken(user);
    await this.updateLastLogin(user);
    return new LoginResponseDto(user.id, user.email, token);
  }

  public async signUp(signUpDto: SignUpRequestDto): Promise<void> {
    if (!checkRules(signUpDto.password)) {
      throw new Error('The password does not reflect the security parameters');
    }

    const emailExists = await this.userRepository.emailExists(signUpDto.email);
    if (emailExists) {
      throw new Error('Email already present on DB');
    }

    // TODO: controllo paramenti password

    const adminPermission = await this.permissionRepository.findOne({
      where: { name: 'ADMIN' },
    });
    const user = {
      email: signUpDto.email,
      passwordHash: hashPassword(signUpDto.password),
      permissions: [adminPermission],
      passwordHistories: [{ passwordHash: hashPassword(signUpDto.password) }],
      person: { firstName: signUpDto.firstName, lastName: signUpDto.lastName },
    };

    let insertUser: User;
    try {
      insertUser = await this.userRepository.addOrUpdate(user as User);
    } catch (e) {
      throw new InternalServerError(e);
    }

    if (signUpDto.companyName) {
      const company = {
        name: signUpDto.companyName,
        users: [insertUser],
      };

      try {
        await this.companyRepository.addOrUpdate(company as Company);
      } catch (e) {
        throw new InternalServerError(e);
      }
    }

    await this.sendEmailToken(
      insertUser,
      signUpDto.callbackUrl,
      `${signUpDto.firstName} ${signUpDto.lastName}`,
    );
  }

  public async verifyEmail(token: string, userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (user.emailConfirmed) {
      throw new Error('Email already confirmed');
    }
    const verificationToken = await this.tokenVerificationRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    if (!verificationToken) {
      throw new InternalServerError('Il token non è stato creato');
    }
    if (new Date() > verificationToken.expiredAt) {
      throw new TokenExpiredError(
        'Il token è scaduto',
        verificationToken.expiredAt,
      );
    }
    if (verificationToken.token !== token) {
      throw new BadRequestError('Il token non corrisponde');
    }
    user.emailConfirmed = true;
    await this.userRepository.addOrUpdate(user);
  }

  // public async generateNewEmailToken(userEmail: string): Promise<void> {
  //   const user = await this.userRepository.findByEmail(userEmail);
  //   await this.sendEmailToken(user, );
  // }

  private async updateLastLogin(user: User): Promise<void> {
    user.lastLogin = new Date();
    await this.userRepository.addOrUpdate(user);
  }

  private async sendEmailToken(
    user: User,
    callbackUrl: string,
    fullName = '',
  ): Promise<void> {
    let token = '';
    for (let i = 0; i < 6; i += 1) {
      token += getRandomAlphaNumeric();
    }

    try {
      await this.tokenVerificationRepository.addOrUpdate({
        token,
        user,
      } as TokenVerification);
    } catch (e) {
      throw new InternalServerError(e);
    }

    const emailText = `
        <div>Dear ${fullName || 'user'}</div>
        </br>
        <div>The verification code is ${token}</div>
        <div>Go to this link and insert token to activate your account: ${callbackUrl}/${
      user.id
    }</div>`;
    await sendEmail([user.email], 'Confirm email 📧', emailText);
  }
}
