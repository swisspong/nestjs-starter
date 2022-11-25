import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule],
})
export class AppModule { }
