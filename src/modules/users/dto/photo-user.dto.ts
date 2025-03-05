import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class PhotoUserDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  description: string;
}
