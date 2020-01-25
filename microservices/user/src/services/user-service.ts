import { UserAddDto, UserUpdateDto } from '@dto';
import { User } from '@entity';
import { hashPassword } from '@helper';
import { validate } from 'class-validator';
import { injectable } from 'tsyringe';
import { DeleteResult, getCustomRepository, In, UpdateResult } from 'typeorm';
import { UserRepository } from '../repositories/user-repository';
import { Permission } from '../entities/permission';
import { options } from 'tsconfig-paths/lib/options';
import { PermissionRepository } from '../repositories/permission-repository';

@injectable()
export class UserService {
  private readonly userRepository = getCustomRepository(UserRepository);
  private readonly permissionRepository = getCustomRepository(
    PermissionRepository,
  );

  public async getAllUsers(): Promise<User[] | [User[], number]> {
    return await this.userRepository.find();
  }

  public async getOne(id: string): Promise<User> {
    return await this.userRepository.getById(id);
  }

  public async save(userDto: UserAddDto): Promise<User> {
    const user = new User();
    user.username = userDto.username;
    user.passwordHash = hashPassword(userDto.password);
    user.permissions = await this.permissionRepository.find({
      id: In(userDto.permissionsId),
    });

    // Validate if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(errors[0].value);
    }

    return await this.userRepository.addOrUpdate(user);
  }

  public async update(id: string, userDto: UserUpdateDto): Promise<void> {
    const user = await this.userRepository.getById(id);
    user.phoneNumber = userDto.phoneNumber;
    user.permissions = await this.permissionRepository.find({
      id: In(userDto.permissionsId),
    });
    await this.userRepository.addOrUpdate(user);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}