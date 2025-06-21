import { Photo } from '../../photos/entities/photo.entity';
import { DestinationDescription } from '../entities/destination-description.entity';

export class ListDestinationDto {
  constructor(
    readonly id: string,
    readonly photos: Photo[],
    readonly name: string,
    readonly target: string,
    readonly price: number,
    readonly description: DestinationDescription,
  ) {}
}
