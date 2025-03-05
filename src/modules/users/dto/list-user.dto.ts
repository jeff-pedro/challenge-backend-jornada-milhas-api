import { Photo } from '../../photos/entities/photo.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoUserDto } from './photo-user.dto';

export class ListUserDto {
    readonly id: string;
    
    readonly firstName: string;
    
    readonly lastName: string;
    
    readonly email: string;

    @ApiProperty({ type: PhotoUserDto })
    readonly photo?: Photo;

    constructor (partial: Partial<ListUserDto>) {
        Object.assign(this, partial);
    }
}
