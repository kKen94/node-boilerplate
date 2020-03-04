import { LoginRequestDto, LoginResponseDto, SignUpRequestDto } from '@dto';
import { AuthService } from '@service';
import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  QueryParam,
} from 'routing-controllers';
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
  public async signUp(@Body() signUpDto: SignUpRequestDto): Promise<void> {
    return await this.authService.signUp(signUpDto);
  }

  @Get('/verify-email/:userId')
  @HttpCode(200)
  public async verifyEmail(@Param('userId') userId: string, @QueryParam('token') token: string): Promise<void> {
    return await this.authService.verifyEmail(token, userId);
  }

  // @Get('/generate-email-token/:userEmail')
  // @HttpCode(200)
  // public async generateEmailToken(@Param('userEmail') userEmail: string): Promise<void> {
  //   return await this.authService.generateNewEmailToken(userEmail);
  // }
}
