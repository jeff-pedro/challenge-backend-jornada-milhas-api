import { ApiProperty } from "@nestjs/swagger";

class UploadPhotoUserDto {
    @ApiProperty({ 
        description: 'Photo to upload', 
        type: 'string',
        format: 'binary'
    })
    avatar: any;
}

export default UploadPhotoUserDto;
  