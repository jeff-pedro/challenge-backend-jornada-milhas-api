import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
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
  @MaxLength(30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]+$/, {
    message: 'password must have at least 1 lowercase letter, 1 uppercase letter, 1 special character, and a number' 
  })
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
