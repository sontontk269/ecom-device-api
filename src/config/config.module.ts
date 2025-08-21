import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import redisConfig from './redis.config'
import databaseConfig from './database.config'
import jwtConfig from './jwt.config'

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig, databaseConfig, jwtConfig]
    })
  ]
})
export class ConfigModule {}
