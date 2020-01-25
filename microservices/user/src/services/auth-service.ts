import { LoginRequestDto, LoginResponseDto } from '@dto';
import { User } from '@entity';
import { checkIfUnencryptedPasswordIsValid, generateToken } from '@helper';
import { NotFoundError, UnauthorizedError } from 'routing-controllers';
import { Error } from 'tslint/lib/error';
import { injectable } from 'tsyringe';
import { getCustomRepository, UpdateResult } from 'typeorm';
import { UserRepository } from '../repositories/userRepository';

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

    //  Check if encrypted password match
    if (
      !checkIfUnencryptedPasswordIsValid(loginDto.password, user.passwordHash)
    ) {
      throw new UnauthorizedError('Password wrong');
    }

    if (!user.emailConfirmed) {
      throw new Error('Email not confirmed');
    }

    const validateActiveDate =
      (user.activeFrom <= new Date() || !user.activeFrom) &&
      (user.activeTo > new Date() || !user.activeTo);

    if (!validateActiveDate || !user.active) {
      throw new Error('User not active');
    }

    const resetPassword =
      user.passwordExpiration <= new Date() || user.forceResetPassword;

    if (resetPassword) {
      return new LoginResponseDto(null, null, null, null, true);
    }

    //  Sign JWT, valid for 1 hour
    const token = generateToken(user);
    await this.updateLastLogin(user);
    return new LoginResponseDto(
      user.id,
      user.email,
      user.username,
      token,
      false,
    );
  }

  public async signUp(): Promise<any> {
    // TODO: creare utente e company
  }

  private async updateLastLogin(user: User): Promise<UpdateResult> {
    user.lastLogin = new Date();
    return await this.userRepository.update(user.id, user);
  }
}
