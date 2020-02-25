import { Permission } from '@entity';
import { PermissionRepository } from '@repository';
import { Connection } from 'typeorm';

export const seedPermission = async (connection: Connection): Promise<void> => {
  console.log('Seeding Permission....');
  const permissionRepo = connection.getCustomRepository(PermissionRepository);
  const fullTable = await permissionRepo.any();
  if (!fullTable) {
    await permissionRepo.addOrUpdateRange(permission as Permission[]);
    console.log('...Permission seeded!');
  } else {
    console.log('...Repository is not empty, skipped');
  }
};

const permission: any[] = [
  {
    name: 'SUPER.ADMIN',
    description: 'Root admin over app admin',
  },
  {
    name: 'ADMIN',
    description: 'Admin company permission',
  },
];
