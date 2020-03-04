import { jwtEagle } from '@config';
import { User } from '@entity';
import * as jwt from 'jsonwebtoken';

export const generateToken = async (user: User): Promise<string> => {
  const permissions = user.permissions;
  const permissionsName = permissions.map(permission => permission.name);
  return jwt.sign(
    {
      permissions: permissionsName,
      userId: user.id,
      email: user.email,
    },
    jwtEagle.secret,
    {
      expiresIn: '24h', // TODO: scadenza mensile + refresh token
      issuer: jwtEagle.iss,
    },
  );
};

export const generateTokenWithCustomPermissions = async (userId: string, ...permissions: string[]): Promise<string> => {
  return jwt.sign(
    {
      permissions,
      userId,
    },
    jwtEagle.secret,
    {
      expiresIn: '24h', // TODO: scadenza mensile + refresh token
      issuer: jwtEagle.iss,
    },
  );
};

export const cleanToken = (token: string): string => {
  if (token.includes(' ')) {
    const pieces = token.split(' ');
    return pieces[pieces.length - 1];
  }
  return token;
};
