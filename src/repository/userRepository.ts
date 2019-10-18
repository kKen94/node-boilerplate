import { User } from "../entity/user";
import { GenericRepository } from "./genericRepository";
import { EntityRepository } from "typeorm";
import { Service } from "typedi";

@Service()
@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {

}