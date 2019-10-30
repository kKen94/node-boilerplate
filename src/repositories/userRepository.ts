import { User } from '../entities/user';
import { GenericRepository } from './genericRepository';
import { EntityRepository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {
  public async findOneByToken(token: string): Promise<User> {
    const id = '';
    // TODO: prendere dal token l'id
    return await this.one(id);
  }
}
