import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestimonialDto {
  @IsNotEmpty()
  @IsString()
  testimonial: string;
}
