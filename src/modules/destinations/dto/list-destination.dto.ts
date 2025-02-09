import { Photo } from '../../photos/entities/photo.entity';

export class ListDestinationDto {
  constructor(
    readonly id: string,
    readonly photos: Photo[],
    readonly name: string,
    readonly target: string,
    readonly descriptiveText: string,
  ) {}
}
