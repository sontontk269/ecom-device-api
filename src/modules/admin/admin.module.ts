import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { AdminUsersModule } from './users/users.module'

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [AdminUsersModule]
})
export class AdminModule {}
