import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PhotoUserDto } from './photo-user.dto';
import { Photo } from '../../photos/entities/photo.entity';
import { IsUniqueEmail } from '../validations/unique-email.validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ValidateNested()
  @Type(() => PhotoUserDto)
  photo?: Photo;

  @IsEmail()
  @IsUniqueEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
