import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { AdminUsersModule } from './users/users.module'
import { AdminCategoriesModule } from './categories/categories.module'

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [AdminUsersModule, AdminCategoriesModule]
})
export class AdminModule {}
