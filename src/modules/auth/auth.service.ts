import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import Redis from 'ioredis'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { RegisterDTO } from '@modules/auth/dto'
import { ActivationService } from '@modules/activation/activation.service'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private redis: Redis,
    private configService: ConfigService,
    private activationService: ActivationService
  ) {}

  async validateUser(email: string, userPassword: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } })
    if (!user) throw new NotFoundException('Email is not found')

    if (user.status !== 'ACTIVE')
      throw new UnauthorizedException('Please activate your account first.')

    const comparePassword = await bcrypt.compare(userPassword, user.password)
    if (!comparePassword) throw new ConflictException('Password is incorrect')

    return user
  }

  async login(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role }

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn')
    })

    const jti = crypto.randomUUID()
    const refreshToken = this.jwtService.sign(
      { id: user.id, jti },
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

    const createdUser = await this.prismaService.user.create({
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

    //send activation email
    await this.activationService.createToken(createdUser.id, createdUser.email)
    return createdUser
  }

  async refreshToken(userId: number, refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.secret')
      })

      const storedToken = await this.redis.get(`refresh:${userId}:${payload.jti}`)
      if (!storedToken || storedToken !== refreshToken)
        throw new UnauthorizedException('Invalid refresh token')

      const newAccessToken = this.jwtService.sign(
        {
          id: userId,
          email: payload.email,
          role: payload.role
        },
        {
          secret: this.configService.get<string>('jwt.secret'),
          expiresIn: this.configService.get<string>('jwt.expiresIn')
        }
      )

      return { accessToken: newAccessToken }
    } catch (error) {
      throw new UnauthorizedException('Refresh token failed')
    }
  }

  async logout(userId: number, jti: string) {
    await this.redis.del(`refresh:${userId}:${jti}`)
  }

  async revokeAll(userId: number) {
    const keys = await this.redis.keys(`refresh:${userId}:*`)
    if (keys.length) await this.redis.del(keys)
  }
}
