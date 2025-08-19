import { Module, Global } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService, WINSTON_MODULE_PROVIDER],
      useFactory: async (configService: ConfigService, logger: Logger) => {
        const redis = new Redis({
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password')
        })

        redis.on('connect', () => {
          logger.info('✅ Connected to Redis successfully')
        })

        redis.on('error', err => {
          logger.error(`❌ Failed to connect to Redis: ${err.message}`)
        })

        redis.on('close', () => {
          logger.warn('⚠️ Redis connection closed')
        })

        return redis
      }
    }
  ],
  exports: ['REDIS_CLIENT']
})
export class RedisModule {}
