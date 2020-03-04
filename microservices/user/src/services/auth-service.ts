import { LoginRequestDto, LoginResponseDto, SignUpRequestDto } from '@dto';
import { Company, TokenVerification, User } from '@entity';
import {
  checkIfUnencryptedPasswordIsValid,
  checkRules,
  generateToken,
  generateTokenWithCustomPermissions,
  getRandomAlphaNumeric,
  getRepo,
  hashPassword,
  sendEmail,
} from '@helper';
import { CompanyRepository, PermissionRepository, TokenVerificationRepository, UserRepository } from '@repository';
import { TokenExpiredError } from 'jsonwebtoken';
import { BadRequestError, InternalServerError, NotFoundError, UnauthorizedError } from 'routing-controllers';
import { injectable } from 'tsyringe';

@injectable()
export class AuthService {
  private readonly userRepository = getRepo(UserRepository);
  private readonly permissionRepository = getRepo(PermissionRepository);
  private readonly companyRepository = getRepo(CompanyRepository);
  private readonly tokenVerificationRepository = getRepo(TokenVerificationRepository);

  public async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    let user: User;
    try {
      user = await this.userRepository.userByEmailWithPermissions(loginDto.email);
    } catch (error) {
      throw new NotFoundError(`User not found`);
    }

    if (user.deleted) {
      throw new NotFoundError(`User not found`);
    }

    if (!checkIfUnencryptedPasswordIsValid(loginDto.password, user.passwordHash)) {
      throw new UnauthorizedError('Password wrong');
    }

    if (!user.emailConfirmed) {
      throw new Error('Email not confirmed');
    }

    const validateActiveDate =
      (user.activeFrom <= new Date() || !user.activeFrom) && (user.activeTo > new Date() || !user.activeTo);

    if (!validateActiveDate || !user.active) {
      throw new Error('User not active');
    }

    const resetPassword = (user.passwordExpiration && user.passwordExpiration <= new Date()) || user.forceResetPassword;

    if (resetPassword) {
      return new LoginResponseDto(null, null, null, true);
    }

    const token = await generateToken(user);
    await this.updateLastLogin(user);
    return new LoginResponseDto(user.id, user.email, token);
  }

  public async signUp(signUpDto: SignUpRequestDto): Promise<LoginResponseDto> {
    if (!checkRules(signUpDto.password)) {
      throw new Error('The password does not reflect the security parameters');
    }

    const emailExists = await this.userRepository.emailExists(signUpDto.email);
    if (emailExists) {
      throw new Error('Email already present on DB');
    }

    // TODO: controllo paramenti password

    const adminPermission = await this.permissionRepository.findOne({ where: { name: 'ADMIN' } });
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

    await this.sendEmailToken(insertUser, `${signUpDto.firstName} ${signUpDto.lastName}`);

    const jwtToken = await generateTokenWithCustomPermissions(insertUser.id, 'EMAIL.VERIFICATION');
    return new LoginResponseDto(insertUser.id, '', jwtToken);
  }

  public async verifyEmail(token: string, user: User): Promise<void> {
    const verificationToken = await this.tokenVerificationRepository.findOne({
      where: {
        userId: user.id,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!verificationToken) {
      throw new InternalServerError('Il token non esiste');
    }
    if (new Date() > verificationToken.expiredAt) {
      throw new TokenExpiredError('Il token è scaduto', verificationToken.expiredAt);
    }
    if (verificationToken.token !== token) {
      throw new BadRequestError('Il token non corrisponde');
    }
    user.emailConfirmed = true;
    await this.userRepository.addOrUpdate(user);
  }

  public async generateNewEmailToken(user: User): Promise<void> {
    await this.sendEmailToken(user);
  }

  private async updateLastLogin(user: User): Promise<void> {
    user.lastLogin = new Date();
    await this.userRepository.addOrUpdate(user);
  }

  private async sendEmailToken(user: User, fullName = ''): Promise<void> {
    let token = '';
    for (let i = 0; i < 6; i += 1) {
      token += getRandomAlphaNumeric();
    }

    try {
      await this.tokenVerificationRepository.addOrUpdate({ token, user } as TokenVerification);
    } catch (e) {
      throw new InternalServerError(e);
    }

    const emailText = `
        <div>Dear ${fullName || 'user'}</div>
        </br>
        <div>The verification code is ${token}</div>`;
    await sendEmail([user.email], 'Confirm email 📧', emailText);
  }
}
