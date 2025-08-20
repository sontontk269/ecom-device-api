import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import Redis from 'ioredis'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { RegisterDTO } from '@modules/auth/dto'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private redis: Redis,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, userPassword: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } })
    if (!user) throw new NotFoundException('Email is not found')

    const comparePassword = await bcrypt.compare(userPassword, user.password)
    if (!comparePassword) throw new ConflictException('Password is incorrect')
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async login(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role }

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn')
    })

    const jti = crypto.randomUUID()
    const refreshToken = this.jwtService.sign(
      { sub: user.id, jti },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn')
      }
    )

    //save refreshToken to redis
    await this.redis.set(`refresh:${user.id}:${jti}`, refreshToken, 'EX', 60 * 60 * 24 * 7)

    return { accessToken, refreshToken }
  }

  async register(user: RegisterDTO) {
    const checkEmail = await this.prismaService.user.findUnique({ where: { email: user.email } })
    if (checkEmail) throw new ConflictException('Email is created in other account')

    const hashPassword = await bcrypt.hash(user.password, 10)

    const createdUser = this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashPassword,
        fullName: user.fullName,
        phone: user?.phone
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true
      }
    })

    return createdUser
  }
}
