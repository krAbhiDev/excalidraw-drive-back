import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './all.exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';
import FetchService from './fetch/fetch.service';
import { PrismaService } from './prisma.service';
@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true,
      load: [configuration]
    },
 
  ),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (cs: ConfigService) => {

      return {
        global: true,
        secret: cs.get('jwt_secret'),
        signOptions: { expiresIn: '30d' },
      }
    },
    inject: [ConfigService]
  }), AuthModule],
  controllers: [AppController],
  providers: [PrismaService,FetchService, AppService, {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter
  }],
})
export class AppModule { }
