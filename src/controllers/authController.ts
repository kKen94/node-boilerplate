import { validate } from 'class-validator';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { checkIfUnencryptedPasswordIsValid, hashPassword } from '@helpers';
import config from '../configs/config';
import { User } from '../entities/user';

class AuthController {
  static login = async (req: Request, res: Response) => {
    //  Check if username and password are set
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    //  Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    //  Check if encrypted password match
    if (!checkIfUnencryptedPasswordIsValid(password, user.passwordHash)) {
      res.status(401).send();
      return;
    }

    //  Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h' },
    );

    //  Send the jwt in the response
    res.send(token);
  };

  static changePassword = async (req: Request, res: Response) => {
    // Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    // Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    // Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    // Check if old password matchs
    if (!checkIfUnencryptedPasswordIsValid(oldPassword, user.passwordHash)) {
      res.status(401).send();
      return;
    }

    // Validate de model (password lenght)
    user.passwordHash = hashPassword(newPassword);
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    await userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;
