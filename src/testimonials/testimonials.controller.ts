import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { ListTestimonialDto } from './dto/list-testimonial.dto';
import { Testimonial } from './entities/testimonial.entity';

@Controller()
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post('/testimonials')
  async create(
    @Body() createTestimonialDto: CreateTestimonialDto,
  ): Promise<{ data: ListTestimonialDto }> {
    const testimonialSaved =
      await this.testimonialsService.create(createTestimonialDto);

    return {
      data: new ListTestimonialDto(
        testimonialSaved.id,
        testimonialSaved.userId,
        testimonialSaved.testimonial,
      ),
    };
  }

  @Get('/testimonials')
  async findAll(): Promise<{ data: Testimonial[] }> {
    const testimonialsList = await this.testimonialsService.findAll();
    return { data: testimonialsList };
  }

  @Get('/testimonials/:id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: object }> {
    const testimonialSaved = await this.testimonialsService.findOne(id);
    return {
      data: testimonialSaved,
    };
  }

  @Patch('/testimonials/:id')
  async update(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
  ): Promise<{ message: string }> {
    await this.testimonialsService.update(id, updateTestimonialDto);

    return {
      message: `Testimonial #${id} was updated`,
    };
  }

  @Delete('/testimonials/:id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.testimonialsService.remove(id);
    return { message: `Testimonial #${id} was deleted` };
  }

  @Get('/testimonials-home')
  async pick(): Promise<{ data: Testimonial[] }> {
    const testimonials = await this.testimonialsService.getRandomTestimonials();
    return { data: testimonials };
  }
}
