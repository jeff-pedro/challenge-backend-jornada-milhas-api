import { Controller, Get, Param, Patch } from '@nestjs/common';
import { Public } from '../../resources/decorators/public-route.decorator';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photoService: PhotosService){}

  @Public()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.photoService.findOne(id);
  }

  @Public()
  @Patch(':id/description')
  autoUpdateDescription(@Param('id') id: number) {
    return this.photoService.generateAndUpdatePhotoDescription(id);
  }
}
