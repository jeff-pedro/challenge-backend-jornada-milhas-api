import {
  IsDecimal,
  IsNotEmpty,
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
  
  @IsString()
  @IsDecimal({ decimal_digits: '2', locale: 'pt-BR' })
  price: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DestinationDescriptionDto)
  description?: DestinationDescriptionDto;
}
