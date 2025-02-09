import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PhotoDestinationDto } from './photo-destination.dto';

export class CreateDestinationDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ValidateNested()
  @Type(() => PhotoDestinationDto)
  photos: PhotoDestinationDto[];

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(160)
  target: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  descriptiveText?: string;
}
