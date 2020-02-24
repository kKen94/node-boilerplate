import { superUser } from '@config';
import { hashPassword } from '@helper';
import { PermissionRepository, UserRepository } from '@repository';
import { Connection } from 'typeorm';
import { User } from '@entity';

export const seedUser = async (connection: Connection): Promise<void> => {
  console.log('Seeding User....');
  const userRepo = connection.getCustomRepository(UserRepository);
  const anyUsers = await userRepo.find();
  if (!anyUsers.length) {
    const permissionRepo = connection.getCustomRepository(PermissionRepository);
    const superPermission = await permissionRepo.findOne({ where: { name: 'SUPER.ADMIN' } });
    user.permissions = [superPermission];
    await userRepo.addOrUpdate(user as User);
    console.log('...User seeded!');
  } else {
    console.log('...Repository is not empty, skipped');
  }
};

const passwordHash = hashPassword(superUser.password);

const user = {
  passwordHash,
  email: superUser.email,
  emailConfirmed: true,
  phoneNumber: '3425999882',
  permissions: [],
  passwordHistories: [{ passwordHash }],
};
