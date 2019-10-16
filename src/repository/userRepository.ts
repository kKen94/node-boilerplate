import { User } from "../entity/user";
import { EntityRepository } from "typeorm";
import { GenericRepository } from "./genericRepository";

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {

}