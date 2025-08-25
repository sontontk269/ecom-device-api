import { Role } from '@common/constants'
import { Roles } from '@common/decorators'
import { JwtAuthGuard } from '@common/guards'
import { RolesGuard } from '@common/guards/roles.guard'
import { Controller, Get, UseGuards } from '@nestjs/common'

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminUserController {
  constructor() {}

  @Get('test')
  async test() {
    return 'test admin api'
  }
}
