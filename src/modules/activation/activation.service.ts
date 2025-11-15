import { EmailService } from '@modules/email/email.service'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ActivationService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService
  ) {}

  async createToken(userId: number, email: string) {
    const token = crypto.randomUUID()
    await this.prismaService.activationToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
      }
    })

    await this.emailService.sendActivationEmail(email, token)
  }

  async activate(token: string) {
    const record = await this.prismaService.activationToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!record) throw new NotFoundException('Invalid or expired token')
    if (record.expiresAt < new Date()) throw new BadRequestException('Token expired')

    await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: { id: record.userId },
        data: { status: 'ACTIVE' }
      }),
      this.prismaService.activationToken.delete({ where: { id: record.id } })
    ])

    return { message: 'Account activated successfully' }
  }

  async resend(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } })
    if (!user) throw new NotFoundException('User not found')
    if (user.status === 'ACTIVE') throw new BadRequestException('Already activated')

    await this.prismaService.activationToken.deleteMany({ where: { userId: user.id } })
    return this.createToken(user.id, user.email)
  }
}
