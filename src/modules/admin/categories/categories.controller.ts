import { Role } from '@common/constants'
import { Roles } from '@common/decorators'
import { PaginationDTO } from '@common/dto'
import { JwtAuthGuard } from '@common/guards'
import { RolesGuard } from '@common/guards/roles.guard'
import { AdminCategoriesService } from '@modules/admin/categories/categories.service'
import { CreateCategoryInputDTO } from '@modules/admin/categories/dto'
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCategoriesController {
  constructor(private adminCategoriesService: AdminCategoriesService) {}

  @Get()
  async getAllCategories(@Query() query: PaginationDTO) {
    return this.adminCategoriesService.getAllCategories(query)
  }

  @Post()
  async createCategory(@Body() body: CreateCategoryInputDTO) {
    return this.adminCategoriesService.createCategory(body)
  }

  @Get(':id')
  async getCategoryDetail(@Param('id', ParseIntPipe) categoryId: number) {
    const category = await this.adminCategoriesService.getCategoryDetail(categoryId)
    if (!category) throw new NotFoundException(`Category with id: ${categoryId} not found`)

    return category
  }
}
