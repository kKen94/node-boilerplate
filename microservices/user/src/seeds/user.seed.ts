import { User } from '@entity';
import { hashPassword } from '@helper';
import { Connection } from 'typeorm';

export const seedUser = async (connection: Connection): Promise<void> => {
  console.log('Seeding User....');
  const anyUsers = await connection
    .createQueryBuilder()
    .select('user')
    .from(User, 'user')
    .getMany();
  if (!anyUsers.length) {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute();
    console.log('...User seeded!');
  } else {
    console.log('...Repository is not empty, skipped');
  }
};

const users = [
  {
    permissions: Promise.resolve([{ name: 'SUPER.ADMIN', description: 'Root admin over app admin' }]),
    passwordHash: hashPassword('Cola_123'), // TODO: questa cosa qui non ci deve stare
    email: 'nicola.taddei.94@gmail.com',
    emailConfirmed: true,
    passwordHistories: Promise.resolve([{ passwordHash: hashPassword('Cola_123') }]),
    // TODO: le promises non vanno
  },
];
