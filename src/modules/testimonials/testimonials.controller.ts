import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { ListTestimonialDto } from './dto/list-testimonial.dto';
import { Testimonial } from './entities/testimonial.entity';
import { Public } from '../../resources/decorators/public-route.decorator';
import { UserRequest } from '../auth/auth.guard';

@Controller()
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post('/testimonials')
  async create(
    @Body() createTestimonialDto: CreateTestimonialDto,
    @Req() req: UserRequest,
  ): Promise<ListTestimonialDto> {
    const userId = req.user.sub
    
    const testimonialSaved = 
      await this.testimonialsService.create(
        createTestimonialDto, 
        userId
      );

    return new ListTestimonialDto(
        testimonialSaved.id,
        testimonialSaved.userId,
        testimonialSaved.testimonial,
      );
  }

  @Public()
  @Get('/testimonials')
  async findAll(): Promise<Testimonial[]> {
    const testimonialsList = await this.testimonialsService.findAll();
    return testimonialsList;
  }

  @Get('/testimonials/:id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<object> {
    const testimonialSaved = await this.testimonialsService.findOne(id);
    return testimonialSaved;
  }

  @Patch('/testimonials/:id')
  async update(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
    @Req() req: UserRequest,
  ): Promise<{ message: string }> {
    const userId = req.user.sub

    await this.testimonialsService.update(id, updateTestimonialDto, userId);

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
  async pick(): Promise<Testimonial[]> {
    const testimonials = await this.testimonialsService.getRandomTestimonials();
    return testimonials;
  }
}
