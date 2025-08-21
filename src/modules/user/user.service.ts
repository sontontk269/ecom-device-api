import { UpdateUserDTO } from '@modules/user/dto'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProfile(userId: number) {
    const user = this.prismaService.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        addresses: true
      }
    })
    if (!user) throw new NotFoundException('User not found!')
    return user
  }

  async updateProfile(userId: number, updateData: UpdateUserDTO) {
    return this.prismaService.user.update({ where: { id: userId }, data: { ...updateData } })
  }
}
