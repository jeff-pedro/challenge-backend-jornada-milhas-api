import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { ListDestinationDto } from './dto/list-destination.dto';
import { Destination } from './entities/destination.entity';
import { Public } from '../../resources/decorators/public-route.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Photo } from '../photos/entities/photo.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import UploadPhotoDestinationDto from './dto/upload-photo-destination.dto';
import { FILE_CONSTRAINTS } from '../../config/constants/app.constants';
import { PaginationDto } from './dto/pagination.dto';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) { }

  /** 
   * Create a destination
   * 
   * @remarks This operation allows you to create a new destination.
   * 
   * @throws {400} Malformatted request body or invalid input.
   * @throws {401} Authorization information is missing or invalid.
   */
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Successful operation.', type: CreateDestinationDto })
  @Post()
  async create(
    @Body() createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    return this.destinationsService.create(createDestinationDto);
  }

  /**
   * 
   * Upload an photo
   *
   * @remarks This operation allows you to upload an photo for some destination.
   * 
   * @throws {400} Missing file or invalid ID supplied. Only UUID format is allowed.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any destination was found with the provided information.
   * @throws {422} Image file is missing or has an invalid format.
   */
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'JPEG/PNG images files of destinations to upload.',
    type: UploadPhotoDestinationDto
  })
  @ApiParam({ name: 'id', description: 'ID of destination to update' })
  @ApiCreatedResponse({ description: 'Successful operation.', type: [Photo] })
  @UseInterceptors(FilesInterceptor('files'))
  @Post(':id/upload')
  async uploadPhotos(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: FILE_CONSTRAINTS.MAX_SIZE })
        .addFileTypeValidator({ fileType: FILE_CONSTRAINTS.ALLOWED_TYPES })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    ) 
    files: Express.Multer.File[]
  ): Promise<Photo[]> {
    return this.destinationsService.attachPhotos(id, files);
  }

  /**
   * Get all destinations
   * 
   * @remarks This operation allows you to get all destinations.
   * 
   * @throws {404} Any destination was found.
   */
  @Public()
  @ApiOkResponse({ description: 'Successful operation', type: Destination })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'The destination name that needs to be fetched.',
    example: 'user1'
  })
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('name') name?: string
  ) {
    return this.destinationsService.findAll(paginationDto, name);
  }

  /**
   * Get destination by ID
   * 
   * @remarks This operation allows you to get one destination by ID.
   * 
   * @throws {400} Invalid ID supplied. Only UUID format is allowed.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any destination was found with the provided ID.
   */
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successful operation.' })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ListDestinationDto> {
    const destination = await this.destinationsService.findOne(id);
    const { id: destId, photos, name, target, price, description } = destination;
    
    return new ListDestinationDto(destId, photos, name, target, price, description);
  }

  /**
   * 
   * Update a destination
   *
   * @remarks This operation allows you to update one destination.
   * 
   * @throws {400} Malformatted request body, invalid input or ID.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any destination was found with the provided ID.
   */
  @ApiOkResponse({ description: 'Successful operation.' })
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ): Promise<{ message: string }> {
    await this.destinationsService.update(id, updateDestinationDto);
    return { message: `Destination #${id} was updated` };
  }

  /**
   * 
   * Delete a destination
   *
   * @remarks This operation allows you to delete one destination.
   * 
   * @throws {400} Invalid ID supplied. Only UUID format is allowed.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any destination was found with the provided ID.
   */
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successful operation.' })
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.destinationsService.remove(id);
    return { message: `Destination #${id} was deleted` };
  }
}
