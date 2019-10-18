
import { UserRepository } from "../repository/userRepository";
import { User } from "../entity/user";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class UserService {

    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository,
        ) { }

    public async getAllUsers(): Promise<User[]> {
        return await this.userRepository.all();
    }

}