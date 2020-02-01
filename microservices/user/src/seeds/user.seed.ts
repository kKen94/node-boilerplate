import { Permission, User } from '@entity';
import { hashPassword } from '@helper';
import { Connection } from 'typeorm';
import { PermissionRepository } from '../repositories/permission-repository';
import { UserRepository } from '../repositories/user-repository';

export const seedUser = async (connection: Connection): Promise<void> => {
  console.log('Seeding User....');
  const userRepo = connection.getCustomRepository(UserRepository);
  const anyUsers = await userRepo.find();
  if (!anyUsers.length) {
    await userRepo.addOrUpdate(user as any);
    console.log('...User seeded!');
  } else {
    console.log('...Repository is not empty, skipped');
  }
};

const user = {
  passwordHash: hashPassword('Cola_123'), // TODO: questa cosa qui non ci deve stare
  email: 'nicola.taddei.94@gmail.com',
  emailConfirmed: true,
  permissions: [{ name: 'SUPER.ADMIN', description: 'Root admin over app admin' }],
  passwordHistories: [{ passwordHash: hashPassword('Cola_123') }],
};
