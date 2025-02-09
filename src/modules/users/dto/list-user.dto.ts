import { Photo } from '../../photos/entities/photo.entity';

export class ListUserDto {
    constructor (
        readonly firstName: string,
        readonly lastName: string,
        readonly email: string,
        readonly photo?: Photo,
    ) {}
}
