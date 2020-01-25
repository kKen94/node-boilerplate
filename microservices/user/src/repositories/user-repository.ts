import { User } from '@entity';
import { EntityRepository } from 'typeorm';
import { GenericRepository } from './genericRepository';

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {
  // public async findOneByToken(token: string): Promise<User> {
  //   return await this.getById(id);
  // }
}
