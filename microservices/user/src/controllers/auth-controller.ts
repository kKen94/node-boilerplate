import { LoginRequestDto, LoginResponseDto, SignUpRequestDto } from '@dto';
import { AuthService } from '@service';
import { Authorized, Body, CurrentUser, Get, HttpCode, JsonController, Param, Post } from 'routing-controllers';
import { container } from 'tsyringe';
import { User } from '@entity';

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
  public async signUp(@Body() signUpDto: SignUpRequestDto): Promise<LoginResponseDto> {
    return await this.authService.signUp(signUpDto);
  }

  @Authorized('EMAIL.VERIFICATION')
  @Get('/verify-email/:token')
  @HttpCode(200)
  public async verifyEmail(@Param('token') token: string, @CurrentUser({ required: true }) user: User): Promise<void> {
    return await this.authService.verifyEmail(token, user);
  }

  @Authorized('EMAIL.VERIFICATION')
  @Get('/generate-email-token')
  @HttpCode(200)
  public async generateEmailToken(@CurrentUser({ required: true }) user: User): Promise<void> {
    return await this.authService.generateNewEmailToken(user);
  }
}
