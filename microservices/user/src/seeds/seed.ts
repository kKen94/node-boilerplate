import { Connection } from 'typeorm';
import { seedUser } from './user.seed';

export const seed = async (connection: Connection): Promise<void> => {
  await seedUser(connection);
};
