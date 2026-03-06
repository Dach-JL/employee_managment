import { Injectable } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class FilesService {
    async handleFileUpload(file: Express.Multer.File) {
        return {
            originalname: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`,
        };
    }
}
