import { PaginationDTO } from '@common/dto'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AdminUserService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers({ page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' }: PaginationDTO) {
    const skip = (page - 1) * limit
    const take = limit

    const [users, count] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        skip,
        take,
        orderBy: { [sortBy]: order },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          avatar: true,
          createdAt: true
        }
      }),
      this.prismaService.user.count()
    ])

    return {
      users,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    }
  }
}
