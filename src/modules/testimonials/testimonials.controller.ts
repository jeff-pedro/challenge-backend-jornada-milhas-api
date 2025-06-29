import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { ListTestimonialDto } from './dto/list-testimonial.dto';
import { Testimonial } from './entities/testimonial.entity';
import { Public } from '../../common/decorators/public-route.decorator';
import { UserRequest } from '../auth/auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dtos/paginated.dto';
import { PaginationQueryParamsDto } from 'src/common/dtos/pagination-query-params.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

@Controller()
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  /** 
   * Create a testimonial
   * 
   * @remarks This operation allows you to create a new testimonial.
   * 
   * @throws {400} Malformatted request body or invalid input.
   * @throws {401} Authorization information is missing or invalid.
   */
  @Post('/testimonials')
  @ApiBearerAuth()
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
    return new ListTestimonialDto(testimonialSaved);
  }

  /**
   * Get all testimonials
   * 
   * @remarks This operation allows you to retrieve a list of all testimonials.
   * 
   * @throws {404} Any testimonial was found.
   */
  @ApiPaginatedResponse(Testimonial)
  @Public()
  @Get('/testimonials')
  async findAll(
    @Query() paginationDto: PaginationQueryParamsDto
  ): Promise<PaginatedDto<Testimonial>> {
    const testimonials = await this.testimonialsService.findAll(paginationDto);
    return testimonials;
  }

  /**
   * Get testimonial by ID
   * 
   * @remarks This operation allows you to get one testimonial by ID.
   * 
   * @throws {400} Invalid ID supplied. Only UUID format is allowed.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any testimonial was found with the provided ID.
   */
  @ApiBearerAuth()
  @Get('/testimonials/:id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ListTestimonialDto> {
    const testimonialSaved = await this.testimonialsService.findOne(id);
    return new ListTestimonialDto(testimonialSaved);
  }


  /**
   * 
   * Update a testimonial
   *
   * @remarks This operation allows you to update one testimonial.
   * 
   * @throws {400} Malformatted request body, invalid input or ID.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {403} User cannot access this testimonial.
   * @throws {404} Any testimonial was found with the provided ID.
   */
  @Patch('/testimonials/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successful operation.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
    @Req() req: UserRequest,
  ): Promise<{ message: string }> {
    const userId = req.user.sub

    await this.testimonialsService.update(id, updateTestimonialDto, userId);

    return {
      message: `Testimonial #${id} was updated.`,
    };
  }

  /**
   * 
   * Delete a testimonial
   *
   * @remarks This operation allows you to delete one testimonial.
   * 
   * @throws {400} Invalid ID supplied. Only UUID format is allowed.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any testimonial was found with the provided ID.
   */
  @Delete('/testimonials/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successful operation.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.testimonialsService.remove(id);
    return { message: `Testimonial #${id} was deleted.` };
  }

  /**
   * 
   * Get random testimonials
   *
   * @remarks This operation allows you to retrieve 3 random testimonials.
   * 
   * @throws {404} Any testimonial was found.
   */
  @Public()
  @Get('/testimonials-home')
  async pick(): Promise<ListTestimonialDto[]> {
    const testimonials = await this.testimonialsService.getRandomTestimonials();
    return testimonials;
  }
}
