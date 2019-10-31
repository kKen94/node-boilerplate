import { validate } from "class-validator";
import {
  DeleteResult,
  getCustomRepository,
  InsertResult,
  UpdateResult,
} from "typeorm";
import { UserAddDto, UserUpdateDto } from "../entities/dto/userDto";
import { User } from "../entities/user";
import { UserRepository } from "../repositories/userRepository";

export class UserService {
  private readonly userRepository = getCustomRepository(UserRepository);

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.all();
  }

  public async getOne(id: string): Promise<User> {
    return await this.userRepository.one(id);
  }

  public async save(userDto: UserAddDto): Promise<InsertResult> {
    const user = new User();
    user.username = userDto.username;
    user.passwordHash = userDto.password;
    user.role = userDto.role;

    // Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(errors[0].value);
    }

    // Hash the password, to securely store on DB
    user.hashPassword();
    // TODO: Spostare dall'entità i metodi e spostarli in una utility

    return await this.userRepository.add(user);
  }

  public async update(
    id: string,
    userDto: UserUpdateDto
  ): Promise<UpdateResult> {
    const user = await this.userRepository.one(id);
    user.phoneNumber = userDto.phoneNumber;
    user.role = userDto.role;
    return await this.userRepository.update(id, user);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
