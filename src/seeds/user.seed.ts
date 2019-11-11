import { hashPassword } from '@helpers';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../entities/user';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute();
  }
}

const users = [
  {
    role: 'ADMIN',
    passwordHash: hashPassword('Cola_123'),
    username: 'tadde',
    email: 'nicola.taddei.94@gmail.com',
    emailConfirmed: true,
  },
];
