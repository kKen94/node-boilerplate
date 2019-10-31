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
import { UserAddDto, UserUpdateDto } from '../entities/dto/userDto';
import { UserService } from '../services/userService';
import { container } from 'tsyringe';

@JsonController('/users')
export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = container.resolve(UserService);
  }

  @Get()
  @HttpCode(200)
  public async getAll() {
    return await this.userService.getAllUsers();
  }

  // @Authorized("ADMIN")
  @Get('/:id')
  @HttpCode(200)
  public async getOne(@Param('id') id: string) {
    return await this.userService.getOne(id);
  }

  @Authorized()
  @HttpCode(201)
  @Post()
  public async save(@Body() userDto: UserAddDto) {
    return await this.userService.save(userDto);
  }

  @Authorized()
  @HttpCode(204)
  @Put('/:id')
  public async update(@Param('id') id: string, @Body() userDto: UserUpdateDto) {
    return await this.userService.update(id, userDto);
  }

  @Authorized()
  @HttpCode(204)
  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
