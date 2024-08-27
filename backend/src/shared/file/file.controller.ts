import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { FileDto } from './file.dto';
import { generate } from 'randomstring';
import { extname } from 'path';

const storage = diskStorage({
  destination(req, file, callback) {
    const { uploadDestination } = req.body;

    if (!uploadDestination) {
      return callback(new Error('No upload destination specified'), null);
    }

    callback(null, `uploads/${uploadDestination}`);
  },
  filename(req, file, callback) {
    const extension = extname(file.originalname);
    callback(null, `${file.fieldname}-${generate(16)}${extension}`);
  },
});

@Controller('file')
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@Body() body: FileDto, @UploadedFile() file: Express.Multer.File) {
    return { body, file: file.buffer.toString() };
  }
}
