import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDestinationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(160)
  target: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  descriptiveText?: string;
}
