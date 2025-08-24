import { Module } from '@nestjs/common'
import { CommonModule } from '@common/common.module'
import { AppController } from 'src/app.controller'
import { LoggerModule } from '@common/logger/logger.module'
import { AdminInitService } from '@common/admin-init.service'
import { UserModule } from '@modules/user/user.module'
import { ConfigModule } from './config/config.module'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { AuthModule } from './modules/auth/auth.module'
import { EmailModule } from './modules/email/email.module'
import { ActivationModule } from './modules/activation/activation.module'

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    RedisModule,
    CommonModule,
    LoggerModule,
    AuthModule,
    UserModule,
    EmailModule,
    ActivationModule
  ],
  controllers: [AppController],
  providers: [AdminInitService]
})
export class AppModule {}
