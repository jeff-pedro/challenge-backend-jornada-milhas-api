import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { DestinationDescriptionDto } from './destination-description.dto';
import { Type } from 'class-transformer';

export class CreateDestinationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(160)
  target: string;
  
  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional() 
  @ValidateNested()
  @Type(() => DestinationDescriptionDto)
  description?: DestinationDescriptionDto;
}
