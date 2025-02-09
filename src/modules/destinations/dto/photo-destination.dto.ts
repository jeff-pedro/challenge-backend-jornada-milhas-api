import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class PhotoDestinationDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  description: string;
}
