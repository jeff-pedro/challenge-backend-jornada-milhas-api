import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class PhotoUserDto {
  @ApiProperty({ example: 'http://galaxy.io/img/profile.png'})
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'The profile photo'})
  @IsOptional()
  @IsString()
  description: string;
}
