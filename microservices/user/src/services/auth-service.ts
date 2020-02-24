import { LoginRequestDto, LoginResponseDto, SignUpRequestDto } from '@dto';
import { Company, User } from '@entity';
import { checkIfUnencryptedPasswordIsValid, generateToken, getRepo, hashPassword } from '@helper';
import { CompanyRepository, PermissionRepository, UserRepository } from '@repository';
import { InternalServerError, NotFoundError, UnauthorizedError } from 'routing-controllers';
import { Error } from 'tslint/lib/error';
import { injectable } from 'tsyringe';

@injectable()
export class AuthService {
  private readonly userRepository = getRepo(UserRepository);
  private readonly permissionRepository = getRepo(PermissionRepository);
  private readonly companyRepository = getRepo(CompanyRepository);

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
    return new LoginResponseDto(user.id, user.email, token, false);
  }

  public async signUp(signUpDto: SignUpRequestDto): Promise<any> {
    const emailExists = await this.userRepository.emailExists(signUpDto.email);
    if (emailExists) {
      throw new Error('Email already present on DB');
    }

    // TODO: controllo paramenti password

    const adminPermission = await this.permissionRepository.findOne({ where: { name: 'ADMIN' } });
    const user = {
      email: signUpDto.email,
      phoneNumber: signUpDto.phoneNumber,
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

    const company = {
      name: signUpDto.companyName,
      vatNumber: signUpDto.vatNumber,
      users: [insertUser],
    };

    try {
      await this.companyRepository.addOrUpdate(company as Company);
    } catch (e) {
      throw new InternalServerError(e);
    }

    /* TODO: inviare la mail per la verifica,
       https://developers.google.com/gmail/api/guides/,
       https://stackoverflow.com/questions/46566748/send-email-from-server-via-a-g-suite-email-address
       https://medium.com/the-andela-way/how-to-implement-email-verification-feature-in-your-nodejs-app-using-express-sendgrid-sequelize-e5b255bf92a2
    */
  }

  private async updateLastLogin(user: User): Promise<void> {
    user.lastLogin = new Date();
    await this.userRepository.addOrUpdate(user);
  }
}
