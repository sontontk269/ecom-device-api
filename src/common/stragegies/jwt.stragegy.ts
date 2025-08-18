import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req?.cookies?.['accessToken']]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey'
    })
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email }
  }
}
