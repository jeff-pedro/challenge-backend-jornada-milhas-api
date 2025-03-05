import { ApiProperty } from "@nestjs/swagger";

class FilesUploadDto {
    @ApiProperty({ 
        description: 'Photo to upload', 
        type: 'array', 
        items: { type: 'string', format: 'binary' } 
    })
    files: any[];
}

export default FilesUploadDto;
  