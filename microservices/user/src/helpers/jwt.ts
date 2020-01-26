import { User } from '@entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import config from '../configs/config';

export const generateToken = async (user: User): Promise<string> => {
  // TODO: controllare che effettivamente ci siano
  const permissions = await user.permissions;
  const permissionsName = permissions.map(permission => permission.name);
  return jwt.sign(
    {
      permissions: permissionsName,
      userId: user.id,
      email: user.email,
    },
    config.jwtSecret,
    {
      expiresIn: '24h', // TODO: scadenza mensile + refresh token
      issuer: config.iss,
    },
  );
};
