import { UserAddDto, UserUpdateDto } from '@dto';
import { User } from '@entity';
import { UserService } from '@service';
import {
  Authorized,
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { container } from 'tsyringe';
import { DeleteResult } from 'typeorm';

@JsonController('/')
export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = container.resolve(UserService);
  }

  @Get()
  @HttpCode(200)
  public async getAll(): Promise<User[] | [User[], number]> {
    return await this.userService.getAllUsers();
  }

  // @Authorized("ADMIN")
  @Get('/:id')
  @HttpCode(200)
  public async getOne(@Param('id') id: string): Promise<User> {
    return await this.userService.getOne(id);
  }

  @Authorized()
  @HttpCode(201)
  @Post()
  public async save(@Body() userDto: UserAddDto): Promise<User> {
    return await this.userService.save(userDto);
  }

  @Authorized()
  @HttpCode(204)
  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() userDto: UserUpdateDto,
  ): Promise<void> {
    await this.userService.update(id, userDto);
  }

  @Authorized()
  @HttpCode(204)
  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.userService.delete(id);
  }
}
