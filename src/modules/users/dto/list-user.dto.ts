import { Photo } from '../../photos/entities/photo.entity';
import { ApiHideProperty } from '@nestjs/swagger';

export class ListUserDto {
    readonly id: string;
    
    readonly firstName: string;
    
    readonly lastName: string;
    
    readonly email: string;

    @ApiHideProperty()
    readonly photo?: Photo;

    constructor (partial: Partial<ListUserDto>) {
        Object.assign(this, partial);
    }
}
