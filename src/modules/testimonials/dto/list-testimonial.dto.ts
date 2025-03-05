export class ListTestimonialDto {
  readonly id: string;
  readonly testimonial: string
  readonly userId: string;
  
  constructor(partial: Partial<ListTestimonialDto>) {
    Object.assign(this, partial);
  }
}
