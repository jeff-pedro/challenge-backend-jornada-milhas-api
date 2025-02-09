import { UUIDTypes } from 'uuid';
import { Photo } from '../../photos/entities/photo.entity';

export class ListUserDto {
    constructor (
        readonly id: UUIDTypes,
        readonly firstName: string,
        readonly lastName: string,
        readonly email: string,
        readonly photo?: Photo,
    ) {}
}
