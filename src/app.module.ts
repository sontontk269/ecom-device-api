import { Module } from '@nestjs/common'
import { CommonModule } from '@common/common.module'
import { AppController } from 'src/app.controller'
import { LoggerModule } from '@common/logger/logger.module'
import { ConfigModule } from './config/config.module'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [ConfigModule, PrismaModule, RedisModule, CommonModule, LoggerModule, AuthModule],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
