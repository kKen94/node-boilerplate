import { LoginRequestDto } from '@dto';
import { User } from '@entity';
import { checkIfUnencryptedPasswordIsValid } from '@helper';
import * as jwt from 'jsonwebtoken';
import { NotFoundError, UnauthorizedError } from 'routing-controllers';
import { injectable } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import config from '../configs/config';
import { UserRepository } from '../repositories/userRepository';

@injectable()
export class AuthService {
  private readonly userRepository = getCustomRepository(UserRepository);

  public async login(loginDto: LoginRequestDto): Promise<string> {
    let user: User;
    try {
      user = await this.userRepository.one({
        where: { username: loginDto.username },
      });
    } catch (error) {
      throw new NotFoundError(`User was not found.`);
    }

    //  Check if encrypted password match
    if (
      !checkIfUnencryptedPasswordIsValid(loginDto.password, user.passwordHash)
    ) {
      throw new UnauthorizedError('Password wrong');
    }

    //  Sing JWT, valid for 1 hour
    return jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h' },
    );
  }
}
