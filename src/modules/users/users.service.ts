import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Photo } from '../photos/entities/photo.entity';
import { PaginationQueryParamsDto } from 'src/common/dtos/pagination-query-params.dto';
import { PaginatedDto } from 'src/common/dtos/paginated.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async findAll(params: PaginationQueryParamsDto): Promise<PaginatedDto<User>> {
    const { page, limit } = params;
    const offset = (page - 1) * limit

    const [users,  total] = await this.userRepository.findAndCount({
      relations: ['photo'],
      select: { photo: { url: true } },
      skip: offset,
      take: limit,
    });

    if (users.length === 0) {
      throw new NotFoundException('Any user was found');
    }

    return {
      total,
      limit,
      offset,
      results: users,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.findUserBy({ id });
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.findUserBy({ email });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.findUserBy({ id });

    const updatedUser = this.prepareUserUpdate(user, updateUserDto);

    await this.userRepository.save(updatedUser);
  }

  private prepareUserUpdate(user: User, updateUserDto: UpdateUserDto): User {
    const updatedUser = { ...user, ...updateUserDto };

    if (updateUserDto.photo && user.photo !== null) {
      updatedUser.photo = { ...user.photo, ...updateUserDto.photo };
    }

    return new User(updatedUser);
  }

  private async findUserBy(where: object): Promise<User> {
    const user = await this.userRepository.findOne({
      where,
      relations: ['photo'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.delete(id);

    if (user.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async attachPhoto(id: string, file: Express.Multer.File): Promise<Photo> {
    const user = await this.findUserBy({ id });

    if (!user.photo) {
      user.photo = new Photo();
    }

    user.photo.url = (file as any).location ?? file.path; 

    await this.userRepository.save(user);
    
    return user.photo;
  }
}
