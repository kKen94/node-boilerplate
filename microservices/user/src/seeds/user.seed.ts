import { User } from '@entity';
import { hashPassword } from '@helper';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

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
    permissions: [
      { name: 'SUPER.ADMIN', description: 'Root admin over app admin' },
    ],
    passwordHash: hashPassword('Cola_123'), // TODO: questa cosa qui non ci deve stare
    username: 'tadde',
    email: 'nicola.taddei.94@gmail.com',
    emailConfirmed: true,
  },
  // TODO: aggiungere il password history(?)
];
