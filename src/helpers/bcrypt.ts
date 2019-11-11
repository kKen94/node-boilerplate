import * as bcrypt from 'bcryptjs';

export const hashPassword = (passwordToHash: string): string =>
  bcrypt.hashSync(passwordToHash, 8);

export const checkIfUnencryptedPasswordIsValid = (
  unencryptedPassword: string,
  passwordHash: string,
): boolean => bcrypt.compareSync(unencryptedPassword, passwordHash);
