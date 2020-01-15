import { UserAddDto, UserUpdateDto } from '@dto';
import { User } from '@entity';
import { hashPassword } from '@helper';
import { validate } from 'class-validator';
import { injectable } from 'tsyringe';
import { DeleteResult, getCustomRepository, UpdateResult } from 'typeorm';
import { UserRepository } from '../repositories/userRepository';

@injectable()
export class UserService {
  private readonly userRepository = getCustomRepository(UserRepository);

  public async getAllUsers(): Promise<User[] | [User[], number]> {
    return await this.userRepository.all();
  }

  public async getOne(id: string): Promise<User> {
    return await this.userRepository.getById(id);
  }

  public async save(userDto: UserAddDto): Promise<User> {
    const user = new User();
    user.username = userDto.username;
    user.passwordHash = hashPassword(userDto.password);
    user.role = userDto.role;

    // Validate if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(errors[0].value);
    }

    return await this.userRepository.addOrUpdate(user);
  }

  public async update(
    id: string,
    userDto: UserUpdateDto,
  ): Promise<UpdateResult> {
    const user = await this.userRepository.getById(id);
    user.phoneNumber = userDto.phoneNumber;
    user.role = userDto.role;
    return await this.userRepository.update(id, user);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
