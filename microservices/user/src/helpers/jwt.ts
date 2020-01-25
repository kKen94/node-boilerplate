import { User } from '@entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import config from '../configs/config';

export const generateToken = (user: User): string => {
  // TODO: controllare che effettivamente ci siano
  const permissions = user.permissions.map((permission) => permission.name);

  return jwt.sign(
    {
      permissions,
      userId: user.id,
      username: user.username,
    },
    config.jwtSecret,
    {
      expiresIn: '24h',
      issuer: config.iss,
    },
  );
};
