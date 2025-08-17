import { Module } from '@nestjs/common'
import { CommonModule } from '@common/common.module'
import { AppController } from 'src/app.controller'
import { ConfigModule } from './config/config.module'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'

@Module({
  imports: [ConfigModule, PrismaModule, RedisModule, CommonModule],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
