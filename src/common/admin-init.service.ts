import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { Role } from '@common/constants'

@Injectable()
export class AdminInitService implements OnModuleInit {
  constructor(private prismaService: PrismaService) {}

  async onModuleInit() {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com'
    const password = process.env.ADMIN_PASSWORD || 'admin'

    const admin = await this.prismaService.user.findUnique({ where: { email } })

    if (!admin) {
      const hashPassword = await bcrypt.hash(password, 10)

      await this.prismaService.user.create({
        data: {
          email,
          fullName: '',
          password: hashPassword,
          role: Role.ADMIN
        }
      })
      console.log(`Admin created: ${email}`)
    } else {
      console.log(`Admin already exists: ${email}`)
    }
  }
}
