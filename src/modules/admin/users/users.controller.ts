import { Role } from '@common/constants'
import { Roles } from '@common/decorators'
import { PaginationDTO } from '@common/dto'
import { JwtAuthGuard } from '@common/guards'
import { RolesGuard } from '@common/guards/roles.guard'
import { AdminUserService } from '@modules/admin/users/users.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminUserController {
  constructor(private adminUserService: AdminUserService) {}

  @Get('test')
  async test() {
    return 'test admin api 123'
  }

  @Get()
  async getAllUsers(@Query() query: PaginationDTO) {
    return this.adminUserService.getAllUsers(query)
  }
}
