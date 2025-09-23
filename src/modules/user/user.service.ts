import { UpdateUserDTO } from '@modules/user/dto'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prismaService.user.findFirst({
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

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found!')
    const comparePassword = await bcrypt.compare(oldPassword, user.password)

    if (!comparePassword) throw new ConflictException('Password is incorrect')

    const hashNewPassword = await bcrypt.hash(newPassword, 10)
    return this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashNewPassword }
    })
  }
}
