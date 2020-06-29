import { User } from '@entity';
import { EntityRepository } from 'typeorm';
import { GenericRepository } from './generic-repository';

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {
  public async findByIdWithPermissions(id: string): Promise<User> {
    return await this.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  public async findByEmailWithPermissions(email: string): Promise<User> {
    return await this.findOne({
      where: { email },
      relations: ['permissions'],
    });
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.findOne({ where: { email } });
  }

  public async emailExists(email: string): Promise<boolean> {
    return await this.any({ where: { email } });
  }
}
