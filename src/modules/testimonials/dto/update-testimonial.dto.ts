import { PickType } from '@nestjs/mapped-types';
import { CreateTestimonialDto } from './create-testimonial.dto';

export class UpdateTestimonialDto extends PickType(CreateTestimonialDto, [
  'testimonial',
]) {}
