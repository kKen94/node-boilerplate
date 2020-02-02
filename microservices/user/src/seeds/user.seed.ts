import { superUser } from '@config';
import { hashPassword } from '@helper';
import { UserRepository } from '@repository';
import { Connection } from 'typeorm';

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
  passwordHash: hashPassword(superUser.password),
  email: superUser.email,
  emailConfirmed: true,
  phoneNumber: '3425999882',
  permissions: [{ name: 'SUPER.ADMIN', description: 'Root admin over app admin' }],
  passwordHistories: [{ passwordHash: hashPassword(superUser.password) }],
};
