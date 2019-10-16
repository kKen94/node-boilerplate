import { getCustomRepository } from 'typeorm';
import { UserRepository } from "../repository/userRepository";
import { User } from "../entity/user";
import { Service } from "../utils/injection";

@Service()
export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = getCustomRepository(UserRepository);
    }

    public async getAllUsers(): Promise<User[]> {
        return await this.userRepository.all();
    }

}