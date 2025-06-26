import { ApiProperty } from "@nestjs/swagger";

class UploadPhotoDestinationDto {
    @ApiProperty({ 
        description: 'Photo to upload', 
        type: 'array', 
        items: { type: 'string', format: 'binary' } 
    })
    files: any[];
}

export default UploadPhotoDestinationDto;
  