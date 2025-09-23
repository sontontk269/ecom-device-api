import { PaginationDTO } from '@common/dto'
import { CategoryDTO, CreateCategoryDTO } from '@modules/admin/categories/dto'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AdminCategoriesService {
  constructor(
    private prismaService: PrismaService,
    @Inject('REDIS_CLIENT') private redis: Redis
  ) {}

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

  async createCategory(data: CreateCategoryDTO) {
    return this.prismaService.$transaction(async tx => {
      //if exist parentId => check parent
      if (data.parentId) {
        const parent = await tx.category.findUnique({ where: { id: data.parentId } })
        if (!parent) throw new BadRequestException('Parent category not found')
      }

      //sortOrder
      let sortOrder = data.sortOrder
      if (sortOrder === undefined) {
        const maxSort = await tx.category.aggregate({
          _max: { sortOrder: true },
          where: { parentId: data.parentId ?? null }
        })

        sortOrder = (maxSort._max.sortOrder ?? 0) + 1
      }

      //create new category

      try {
        const category = await tx.category.create({
          data: {
            name: data.name,
            parentId: data.parentId ?? null,
            description: data.description,
            imageUrl: data.imageUrl,
            isActive: data.isActive ?? true,
            sortOrder
          }
        })

        await this.redis.del('categories')

        return category
      } catch (error) {
        if (error.code === 'P2002') throw new BadRequestException('Category name already exists')

        throw new BadRequestException('Create category fail')
      }
    })
  }

  async getCategoryDetail(categoryId: number): Promise<CategoryDTO | null> {
    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId },
      include: { parent: true, children: true }
    })

    if (!category) return null

    const { parent, children, ...rest } = category

    return {
      ...rest,
      parentId: parent?.id || null,
      parent: parent
        ? {
            id: parent.id,
            name: parent.name
          }
        : null,
      children: children.map(c => ({
        id: c.id,
        name: c.name
      }))
    }
  }
}
