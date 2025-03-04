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
import FilesUploadDto from './dto/files-upload.dto';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  /** 
   * Create a destination
   * 
   * @remarks This operation allows you to create a new destination.
   * 
   * @throws {400} Bad Request.
   * @throws {401} Authorization information is missing or invalid.
   */
  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Successful operation.', type: CreateDestinationDto})
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
   * @throws {400} Invalid ID supplied. Only UUID format is allowed.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any destination was found with the provided information.
   * @throws {422} Image file is missing or has an invalid format.
   */
  @Post(':id/upload')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'JPEG images files of destinations to upload.',
    type: FilesUploadDto
  })
  @ApiParam({ name: 'id', description: 'ID of destination to update' })
  @ApiCreatedResponse({ description: 'Successful operation.', type: [Photo]})
  async uploadPhotos(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 })
        .addFileTypeValidator({ fileType: 'image/jpeg' })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    ) files: Express.Multer.File[]
  ): Promise<Photo[]> {
    return this.destinationsService.attachPhotos(id, files);
  }

  /**
   * Get all destinations
   * 
   * @remarks This operation allows you to get all destinations.
   * 
   * @throws {404} Not Found.
   */
  @Public()
  @Get()
  @ApiOkResponse({ description: 'Successful operation', type: Destination})
  @ApiQuery({ name: 'name', required: false })
  // TODO: Seperar em 2 métodos, uma para todos e um que filtra por nome.
  async findAll(@Query('name') name?: string): Promise<Destination[]> {
    return this.destinationsService.findAll(name);
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
  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successful operation.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ListDestinationDto> {
    const destination = await this.destinationsService.findOne(id);
    const { id: destId, photos, name, target, descriptiveText } = destination;
    return new ListDestinationDto( destId, photos, name, target, descriptiveText)
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
  @Patch(':id')
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiBearerAuth()
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
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successful operation.' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.destinationsService.remove(id);
    return { message: `Destination #${id} was deleted` };
  }
}
