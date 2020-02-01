import { User } from '@entity';
import { EntityRepository } from 'typeorm';
import { GenericRepository } from './generic-repository';

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {
  public async userByIdWithPermissions(id: string): Promise<User> {
    return await this.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  public async userByEmailWithPermissions(email: string): Promise<User> {
    return await this.findOne({
      where: { email },
      relations: ['permissions'],
    });
  }
}
