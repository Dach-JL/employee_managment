import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
@ApiBearerAuth()
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Upload a file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = uuidv4();
                cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.filesService.handleFileUpload(file);
    }

    @Get(':filename')
    @ApiOperation({ summary: 'Retrieve an uploaded file' })
    serveFile(@Param('filename') filename: string, @Res() res) {
        return res.sendFile(join(process.cwd(), 'uploads', filename));
    }
}
