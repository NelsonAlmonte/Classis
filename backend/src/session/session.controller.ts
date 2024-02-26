import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { Prisma, Sessions } from '@prisma/client';
import { unlink, unlinkSync, writeFileSync } from 'fs';
import { generate } from 'randomstring';

@Controller('session')
export class SessionController {
  constructor(private sessionsService: SessionService) {}

  @Get()
  async sessions(): Promise<Sessions[]> {
    return await this.sessionsService.getSessions();
  }

  @Get(':id')
  async session(@Param('id') id: number): Promise<Sessions> {
    return await this.sessionsService.getSession(Number(id));
  }

  @Post()
  async create(
    @Body() createSessionDto: Prisma.SessionsCreateInput,
  ): Promise<Sessions | BadRequestException> {
    createSessionDto.image = this.saveImage(createSessionDto.image);
    const session = await this.sessionsService.createSession(createSessionDto);
    if (!session) {
      throw new BadRequestException('Unexpected error when creating a session');
    }
    return session;
  }

  saveImage(base64: any): string {
    const base64Image = base64.split(';base64,').pop();
    const fileName = `${generate(16)}.jpg`;
    const buffer = Buffer.from(base64Image, 'base64');
    writeFileSync(`uploads/session-image/${fileName}`, buffer);
    return fileName;
  }

  @Put(':id')
  async update(
    @Body() updateSessionDto: Prisma.SessionsUpdateInput,
    @Param('id') id: number,
  ): Promise<Sessions | BadRequestException> {
    if (updateSessionDto.image) {
      const currentSession = await this.sessionsService.getSession(Number(id));
      this.deleteImage(`uploads/session-image/${currentSession.image}`);
      updateSessionDto.image = this.saveImage(updateSessionDto.image);
    }
    const session = await this.sessionsService.updateSession(
      updateSessionDto,
      Number(id),
    );
    if (!session) {
      throw new BadRequestException('Unexpected error when updating a session');
    }
    return session;
  }

  deleteImage(image: string) {
    let isFileDeleted = false;
    unlink(image, (error) => {
      if (!error) {
        isFileDeleted = true;
      }
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const session = await this.sessionsService.deleteSubject(id);
    if (!session) {
      throw new BadRequestException('Unexpected error when deleting a session');
    }
    return session;
  }
}
