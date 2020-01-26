import { LoginRequestDto, LoginResponseDto } from '@dto';
import { Authorized, Body, HttpCode, JsonController, Post } from 'routing-controllers';
import { container } from 'tsyringe';
import { AuthService } from '../services/auth-service';
import { SignUpRequestDto } from '../models/dto/signup-dto';

@JsonController('/auth')
export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = container.resolve(AuthService);
  }

  @Post('/login')
  @HttpCode(200)
  public async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post('/sign-up')
  @HttpCode(201)
  public async signUp(@Body() signUpDto: SignUpRequestDto): Promise<void> {
    await this.authService.signUp(signUpDto);
  }
}
