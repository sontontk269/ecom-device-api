import { Module } from '@nestjs/common'
import { CommonModule } from '@common/common.module'
import { AppController } from 'src/app.controller'
import { LoggerModule } from '@common/logger/logger.module'
import { UserModule } from '@modules/user/user.module'
import { RouterModule } from '@nestjs/core'
import { AdminUsersModule } from '@modules/admin/users/users.module'
import { AdminCategoriesModule } from '@modules/admin/categories/categories.module'
import { ConfigModule } from './config/config.module'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { AuthModule } from './modules/auth/auth.module'
import { EmailModule } from './modules/email/email.module'
import { ActivationModule } from './modules/activation/activation.module'
import { AdminModule } from './modules/admin/admin.module'

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
    ActivationModule,
    AdminModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          { path: 'users', module: AdminUsersModule },
          { path: 'categories', module: AdminCategoriesModule }
        ]
      }
    ])
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
