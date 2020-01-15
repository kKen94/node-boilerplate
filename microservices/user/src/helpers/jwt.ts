import { User } from '@entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import config from '../configs/config';

export const generateToken = (user: User): string => {
  // TODO: prendere i permessi dell'utente
  const permissions = [user.role];

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
