import { LoginRequestDto, LoginResponseDto } from '@dto';
import {
  Authorized,
  Body,
  HttpCode,
  JsonController,
  Post,
} from 'routing-controllers';
import { container } from 'tsyringe';
import { AuthService } from '../services/authService';

@JsonController('/auth')
export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = container.resolve(AuthService);
  }

  @Post('/login')
  @HttpCode(200)
  public async login(
    @Body() loginDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }
}
