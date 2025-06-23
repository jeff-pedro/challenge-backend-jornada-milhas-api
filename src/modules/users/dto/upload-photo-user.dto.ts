import { ApiProperty } from "@nestjs/swagger";

class UploadPhotoUserDto {
    @ApiProperty({ 
        description: 'Photo to upload', 
        type: 'array', 
        items: { type: 'string', format: 'binary' } 
    })
    avatar: any;
}

export default UploadPhotoUserDto;
  