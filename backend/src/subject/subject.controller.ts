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
import { SubjectService } from './subject.service';
import { Prisma, Subjects } from '@prisma/client';
import { writeFileSync } from 'fs';
import { generate } from 'randomstring';

@Controller('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Get()
  async subjects(): Promise<Subjects[]> {
    return await this.subjectService.getSubjects();
  }

  @Get(':id')
  async subject(@Param('id') id: number): Promise<Subjects> {
    return await this.subjectService.getSubject(Number(id));
  }

  @Post()
  async create(
    @Body() createSubjectDto: Prisma.SubjectsCreateInput,
  ): Promise<Subjects | BadRequestException> {
    createSubjectDto.image = this.saveImage(createSubjectDto.image);
    const subject = await this.subjectService.createSubject(createSubjectDto);
    if (!subject) {
      throw new BadRequestException('Unexpected error when creating a subject');
    }
    return subject;
  }

  saveImage(base64: string): string {
    const base64Image = base64.split(';base64,').pop();
    const fileName = `${generate(16)}.jpg`;
    const buffer = Buffer.from(base64Image, 'base64');
    writeFileSync(`uploads/subject-image/${fileName}`, buffer);
    return fileName;
  }

  @Put(':id')
  async update(
    @Body() updateSubjectDto: Prisma.SubjectsUpdateInput,
    @Param('id') id: number,
  ): Promise<Subjects | BadRequestException> {
    const subject = await this.subjectService.updateSubject(
      updateSubjectDto,
      Number(id),
    );
    if (!subject) {
      throw new BadRequestException('Unexpected error when updating a subject');
    }
    return subject;
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
  ): Promise<Subjects | BadRequestException> {
    const subject = await this.subjectService.deleteSubject(Number(id));
    if (!subject) {
      throw new BadRequestException('Unexpected error when deleting a subject');
    }
    return subject;
  }
}
