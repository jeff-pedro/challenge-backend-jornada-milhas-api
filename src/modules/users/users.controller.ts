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
import { HashingPassword } from '../../resources/pipes/hashing-password.pipe';
import { ListUserDto } from './dto/list-user.dto';
import { Public } from '../../resources/decorators/public-route.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor( private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiCreatedResponse({ 
    description: 'The record has been successfully created.',
    type: User
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @Public()
  @Post()
  async create(
    @Body() { password, ...createUserDto }: CreateUserDto,
    @Body('password', HashingPassword) hashedPassword: string,
  ): Promise<ListUserDto> {
    const savedUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword
    });

    const { id, firstName, lastName, email, photo } = savedUser;
    return new ListUserDto(id, firstName, lastName, email, photo);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ 
    description: 'Successfully returned a list of all users.', 
    type: [User]  
  })
  @Public() // TODO: Tornar privada
  @Get()
  async findAll(): Promise<User[]> {
    const user = await this.usersService.findAll();
    return user;
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ 
    description: 'Successfully retrieved the user data.', 
    type: User
  })
  @ApiNotFoundResponse({ description: 'Not Found.'})
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiParam({ description:'ID of user to return',  name: 'id' })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    const user = await this.usersService.findOne(id);
    return user;
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({ 
    description: 'The record has successfully updated.',
    example: { message: 'string' }
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Not Found.'})
  @ApiParam({ description:'ID of user to update',  name: 'id' })
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    await this.usersService.update(id, updateUserDto);
    return { message: `User with id #${id} was updated` };
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiOkResponse({ 
    description: 'The record has successfully deleted.',
    example: { message: 'string' }
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Not Found.'})
  @ApiParam({ description:'ID of user to delete',  name: 'id' })
  @ApiBearerAuth()
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: `User with id #${id} was deleted` };
  }
}
