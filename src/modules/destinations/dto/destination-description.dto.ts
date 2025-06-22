import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class DestinationDescriptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  subtitle: string;
}
