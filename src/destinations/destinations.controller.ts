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
} from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { ListDestinationDto } from './dto/list-destination.dto';
import { Destination } from './entities/destination.entity';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post()
  async create(
    @Body() createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    const destination =
      await this.destinationsService.create(createDestinationDto);
    return destination;
  }

  @Get()
  async findAll(@Query('name') name: string): Promise<Destination[]> {
    const destinations = await this.destinationsService.findAll(name);
    return destinations;
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ListDestinationDto> {
    const destination = await this.destinationsService.findOne(id);

    return new ListDestinationDto(
      destination.id,
      destination.photos,
      destination.name,
      destination.target,
      destination.descriptiveText,
    )
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ): Promise<{ message: string }> {
    await this.destinationsService.update(id, updateDestinationDto);
    return { message: `Destination #${id} was updated` };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.destinationsService.remove(id);
    return { message: `Destination #${id} was deleted` };
  }
}
