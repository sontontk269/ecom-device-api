import { Role } from '@common/constants'
import { Roles } from '@common/decorators'
import { PaginationDTO } from '@common/dto'
import { JwtAuthGuard } from '@common/guards'
import { RolesGuard } from '@common/guards/roles.guard'
import { AdminCategoriesService } from '@modules/admin/categories/categories.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCategoriesController {
  constructor(private adminCategoriesService: AdminCategoriesService) {}
  @Get()
  async getAllCategories(@Query() query: PaginationDTO) {
    return this.adminCategoriesService.getAllCategories(query)
  }
}
