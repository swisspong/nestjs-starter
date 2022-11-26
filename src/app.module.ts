import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), AuthModule, PrismaModule, UserModule],
})
export class AppModule { }
