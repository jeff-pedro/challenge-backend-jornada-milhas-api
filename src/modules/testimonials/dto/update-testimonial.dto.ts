import { PickType } from '@nestjs/swagger';
import { CreateTestimonialDto } from './create-testimonial.dto';

export class UpdateTestimonialDto extends PickType(CreateTestimonialDto, [
  'testimonial',
]) {}
