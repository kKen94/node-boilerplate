import { Connection } from 'typeorm';
import { seedPermission } from './permission.seed';
import { seedUser } from './user.seed';

export const seed = async (connection: Connection): Promise<void> => {
  await seedPermission(connection);
  await seedUser(connection);
};
