import { UserAddDto, UserUpdateDto } from '@dto';
import { User } from '@entity';
import { getRepo, hashPassword } from '@helper';
import { PermissionRepository, UserRepository } from '@repository';
import { validate } from 'class-validator';
import { injectable } from 'tsyringe';
import { DeleteResult, In } from 'typeorm';

@injectable()
export class UserService {
  private readonly userRepository = getRepo(UserRepository);
  private readonly permissionRepository = getRepo(PermissionRepository);

  public async getAllUsers(): Promise<User[] | [User[], number]> {
    return await this.userRepository.find();
  }

  public async getOne(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }

  public async save(userDto: UserAddDto): Promise<User> {
    const user = new User();
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
    const user = await this.userRepository.findById(id);
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
