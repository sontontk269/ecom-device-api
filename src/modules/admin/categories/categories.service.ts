import { PaginationDTO } from '@common/dto'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AdminCategoriesService {
  constructor(private prismaService: PrismaService) {}

  async getAllCategories({
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc'
  }: PaginationDTO) {
    const skip = (page - 1) * limit
    const take = limit

    const [categories, count] = await this.prismaService.$transaction([
      this.prismaService.category.findMany({
        skip,
        take,
        orderBy: { [sortBy]: order }
      }),
      this.prismaService.category.count()
    ])

    return { categories, total: count, page, limit, totalPages: Math.ceil(count / limit) }
  }
}
