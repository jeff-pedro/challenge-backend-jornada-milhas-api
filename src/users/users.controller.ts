import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor( private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const savedUser = await this.usersService.create(createUserDto);
    return savedUser;
  }

  @Get()
  async findAll(): Promise<User[]> {
    const user = await this.usersService.findAll();
    return user;
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    const user = await this.usersService.findOne(id);
    return user;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    await this.usersService.update(id, updateUserDto);
    return { message: `User with id #${id} was updated` };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: `User with id #${id} was deleted` };
  }
}
