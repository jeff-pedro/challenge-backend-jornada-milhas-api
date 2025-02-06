import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('users')
export class UsersController {
  constructor( private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<{ data: User }> {
    const savedUser = await this.usersService.create(createUserDto);
    return { data: savedUser };
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async findAll(): Promise<{ data: User[] }> {
    const user = await this.usersService.findAll();
    return { data: user };
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: User }> {
    const user = await this.usersService.findOne(id);
    return { data: user };
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
