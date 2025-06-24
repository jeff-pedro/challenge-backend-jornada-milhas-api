import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HashingPassword } from '../../resources/pipes/hashing-password.pipe';
import { ListUserDto } from './dto/list-user.dto';
import { Public } from '../../resources/decorators/public-route.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import UploadPhotoUserDto from './dto/upload-photo-user.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_CONSTRAINTS } from '../../config/constants/app.constants';
import { Photo } from '../photos/entities/photo.entity';

@Controller('users')
export class UsersController {
  constructor( private readonly usersService: UsersService) {}

  /**
   * Create a user
   * 
   * @remarks This operation allows you to create a new user.
   * 
   * @throws {400} Malformatted request body or invalid input.
   */
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

    return new ListUserDto(savedUser);
  }

  @Public()
  // API Documentation
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'JPEG/PNG image file of user to upload.',
    type: UploadPhotoUserDto
  })
  @ApiParam({ name: 'id', description: 'ID of user to update' })
  @UseInterceptors(FileInterceptor('avatar'))
  @Post(':id/upload')
  async uploadPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FILE_CONSTRAINTS.MAX_SIZE }),
          new FileTypeValidator({ fileType: FILE_CONSTRAINTS.ALLOWED_TYPES })
        ]
      })
    ) 
    avatar: Express.Multer.File
  ): Promise<Photo> {
      return this.usersService.attachPhoto(id, avatar);
  }
  
  /**
   * 
   * Get all users
   * 
   * @remarks This operation allows you to list all users.
   * 
   * @throws {404} Any destination was found.
   */
  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<User[]> {
    const user = await this.usersService.findAll();
    return user;
  }

  /**
   * 
   * Get user by id
   * 
   * @remarks This operation allows you to get one user by ID.
   * 
   * @throws {400} Invalid ID supplied. Only UUID format is allowed.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any user was found with the provided ID. 
   */
  @ApiParam({ description:'ID of user to return',  name: 'id' })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    const user = await this.usersService.findOne(id);
    return user;
  }

  /**
   * 
   * Update a user
   * 
   * @remarks This operation allows you to update one user.
   * 
   * @throws {400} Malformatted request body, invalid input or ID.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any user was found with the provided ID.
   */
  @ApiOkResponse({ 
    description: 'The record has successfully updated.',
    example: { message: 'string' }
  })
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

  /**
   * 
   * Delete a user
   * 
   * @remarks This operation allows you to delete one user.
   * 
   * @throws {400} Invalid ID supplied. Only UUID format is allowed.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any user was found with the provided ID. 
   */
  @ApiOkResponse({ 
    description: 'The record has successfully deleted.',
    example: { message: 'string' }
  })
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
