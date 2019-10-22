
import { UserRepository } from "../repository/userRepository";
import { User } from "../entity/user";
import { Container, Service } from "typedi";

@Service()
export class UserService {

    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = Container.get(UserRepository);
    }

    public async getAllUsers(): Promise<User[]> {
        return await this.userRepository.all();
    }

}