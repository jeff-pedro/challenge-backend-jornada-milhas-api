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
import { ApiExtraModels, ApiProperty, ApiPropertyOptional, ApiSchema, getSchemaPath } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Peter' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Quill' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ type: PhotoUserDto })
  @ValidateNested()
  @Type(() => PhotoUserDto)
  photo?: Photo;

  @ApiProperty({ example: 'starlord@milano.io' })
  @IsEmail()
  @IsUniqueEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Abc-123' })
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
