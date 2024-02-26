import { Injectable } from '@nestjs/common';
import { Prisma, Sessions } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async getSessions(): Promise<Sessions[]> {
    return this.prisma.sessions.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            last: true,
            image: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getSession(id: number): Promise<Sessions> {
    return this.prisma.sessions.findUnique({
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            last: true,
            image: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id: id,
      },
    });
  }

  async createSession(session: Prisma.SessionsCreateInput): Promise<Sessions> {
    return this.prisma.sessions.create({
      data: session,
    });
  }

  async updateSession(
    session: Prisma.SessionsUpdateInput,
    id: number,
  ): Promise<Sessions> {
    return this.prisma.sessions.update({
      data: session,
      where: {
        id: id,
      },
    });
  }

  async deleteSubject(id: number): Promise<Sessions> {
    return this.prisma.sessions.delete({
      where: {
        id: id,
      },
    });
  }
}
