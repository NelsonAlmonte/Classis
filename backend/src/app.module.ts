import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { SubjectModule } from './subject/subject.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SessionModule } from './session/session.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SubjectModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      renderPath: '/uploads',
    }),
    SessionModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
