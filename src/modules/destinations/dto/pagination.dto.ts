import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";

export class PaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 6;
}