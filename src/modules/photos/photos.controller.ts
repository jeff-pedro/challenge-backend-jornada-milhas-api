import { Controller, Get, Param, Patch } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photoService: PhotosService){}

  /**
   * 
   * Get photo by id
   * 
   * @remarks This operation allows you to get one photo by ID.
   * 
   * @throws {400} Invalid ID supplied. Only integer number is allowed.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any user was found with the provided ID. 
   */
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.photoService.findOne(id);
  }

  /**
   * 
   * Update a photo description with AI
   * 
   * @remarks This operation allows you to update a photo description automatically through AI.
   * 
   * @throws {400} Malformatted request body, invalid ID.
   * @throws {401} Authorization information is missing or invalid.
   * @throws {404} Any photo was found with the provided ID.
   */
  @ApiBearerAuth()
  @Patch(':id/description')
  autoUpdateDescription(@Param('id') id: number) {
    return this.photoService.generateAndUpdatePhotoDescription(id);
  }
}
