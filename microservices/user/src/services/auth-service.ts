import { LoginRequestDto, LoginResponseDto } from '@dto';
import { User } from '@entity';
import { checkIfUnencryptedPasswordIsValid, generateToken } from '@helper';
import { NotFoundError, UnauthorizedError } from 'routing-controllers';
import { Error } from 'tslint/lib/error';
import { injectable } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/user-repository';
import { SignUpRequestDto } from '../models/dto/signup-dto';

@injectable()
export class AuthService {
  private readonly userRepository = getCustomRepository(UserRepository);

  public async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    let user: User;
    try {
      user = await this.userRepository.findOne({
        where: { username: loginDto.username },
      });
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
    // TODO: creare utente, company, person
  }

  private async updateLastLogin(user: User): Promise<void> {
    user.lastLogin = new Date();
    await this.userRepository.addOrUpdate(user);
  }
}
