import { LoginRequestDto } from '@dto';
import { User } from '@entity';
import { checkIfUnencryptedPasswordIsValid } from '@helper';
import * as jwt from 'jsonwebtoken';
import {
  Body,
  HttpCode,
  JsonController,
  NotFoundError,
  Post,
  UnauthorizedError,
} from 'routing-controllers';
import { container } from 'tsyringe';
import { getRepository } from 'typeorm';
import config from '../configs/config';
import { AuthService } from '../services/authService';

@JsonController('/auth')
export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = container.resolve(AuthService);
  }

  @Post('/login')
  @HttpCode(200)
  public async login(@Body() loginDto: LoginRequestDto): Promise<string> {
    return await this.authService.login(loginDto);
  }
}
