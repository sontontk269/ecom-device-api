import { AdminUserController } from '@modules/admin/users/users.controller'
import { AdminUserService } from '@modules/admin/users/users.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [AdminUserController],
  providers: [AdminUserService]
})
export class AdminUsersModule {}
