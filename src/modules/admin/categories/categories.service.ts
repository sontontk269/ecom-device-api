import { PaginationDTO } from '@common/dto'
import { CreateCategoryInputDTO } from '@modules/admin/categories/dto/input/index.js'
import { CategoryDTO } from '@modules/admin/categories/dto/output/index.js'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { PrismaService } from 'src/prisma/prisma.service'
import { toCategoryDTO } from './mapper/category.mapper.js'

@Injectable()
export class AdminCategoriesService {
  constructor(
    private prismaService: PrismaService,
    @Inject('REDIS_CLIENT') private redis: Redis
  ) {}

  private toDto(category: any): CategoryDTO {
    return toCategoryDTO(category)
  }

  async getAllCategories({
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc'
  }: PaginationDTO) {
    const versionKey = 'categories:list:version'
    const version = (await this.redis.get(versionKey)) ?? '1'
    const cacheKey = `categories:list:v${version}:p${page}:l${limit}:s${sortBy}:o${order}`

    const cached = await this.redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }
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

    const result = {
      categories: categories.map(c => this.toDto(c)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    }

    // cache for 5 minutes
    await this.redis.setex(cacheKey, 300, JSON.stringify(result))
    return result
  }

  async createCategory(data: CreateCategoryInputDTO) {
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
        // bump version to invalidate all cached list keys
        await this.redis.incr('categories:list:version')
        return this.toDto(category)
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

    return toCategoryDTO({
      ...rest,
      parent,
      children
    })
  }
}
