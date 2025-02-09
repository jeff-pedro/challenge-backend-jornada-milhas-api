import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateDestinationDto } from './create-destination.dto';

export class UpdateDestinationDto extends PartialType(
  OmitType(CreateDestinationDto, ['photos']),
) {}
