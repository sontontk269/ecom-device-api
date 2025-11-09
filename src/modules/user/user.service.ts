import { UpdateUserValidation } from '@modules/user/dto'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service'
import { toUserDTO } from './mapper/user.mapper.js'

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
        phone: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            city: true,
            district: true,
            ward: true,
            country: true,
            isDefault: true
          }
        }
      }
    })
    if (!user) throw new NotFoundException('User not found!')
    return toUserDTO(user)
  }

  async updateProfile(userId: number, updateData: UpdateUserValidation) {
    return this.prismaService.user.update({ where: { id: userId }, data: { ...updateData } })
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found!')
    const comparePassword = await bcrypt.compare(oldPassword, user.password)

    if (!comparePassword) throw new ConflictException('Password is incorrect')

    const hashNewPassword = await bcrypt.hash(newPassword, 10)
    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashNewPassword }
    })
    return { message: 'Password changed successfully' }
  }
}
