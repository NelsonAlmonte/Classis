import { Injectable } from '@nestjs/common';
import { Prisma, Subjects } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async getSubjects(): Promise<Subjects[]> {
    return this.prisma.subjects.findMany();
  }

  async getSubject(id: number): Promise<Subjects> {
    return this.prisma.subjects.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createSubject(subject: Prisma.SubjectsCreateInput): Promise<Subjects> {
    return this.prisma.subjects.create({
      data: subject,
    });
  }

  async updateSubject(
    subject: Prisma.SubjectsUpdateInput,
    id: number,
  ): Promise<Subjects> {
    return this.prisma.subjects.update({
      data: subject,
      where: {
        id: id,
      },
    });
  }

  async deleteSubject(id: number): Promise<Subjects> {
    return this.prisma.subjects.delete({
      where: {
        id: id,
      },
    });
  }
}
