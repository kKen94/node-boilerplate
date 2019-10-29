import { UserService } from "../services/userService";
import { Authorized, Body, Delete, Get, HttpCode, JsonController, Param, Post, Put } from "routing-controllers";
import { UserAddDto, UserUpdateDto } from "../entities/dto/userDto";
import { Container } from "typedi";

@JsonController("/users")
export class UserController {

    private readonly userService: UserService;

    constructor() {
        this.userService = Container.get(UserService)
    }

    @Get()
    async getAll() {
        return await this.userService.getAllUsers();
    };

    // @Authorized("ADMIN")
    @Get("/:id")
    async getOne(@Param("id") id: string) {
        return await this.userService.getOne(id);
    };

    @Authorized()
    @HttpCode(201)
    @Post()
    async save(@Body() userDto: UserAddDto) {
        return await this.userService.save(userDto);
    };

    @Authorized()
    @HttpCode(204)
    @Put("/:id")
    async update(@Param("id") id: string, @Body() userDto: UserUpdateDto) {
        return await this.userService.update(id, userDto);
    };

    @Authorized()
    @HttpCode(204)
    @Delete("/:id")
    async delete(@Param("id") id: string) {
        return await this.userService.delete(id);
    };
}