import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTestimonialDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  testimonial: string;
}
