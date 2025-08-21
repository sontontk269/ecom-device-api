import { AuthService } from '@modules/auth/auth.service'
import { LoginDTO, RegisterDTO } from '@modules/auth/dto'
import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common'
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(StatusCodes.OK)
  async login(@Body() body: LoginDTO, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(body.email, body.password)
    const tokens = await this.authService.login(user)

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return { user, accessToken: tokens.accessToken }
  }

  @Post('register')
  @HttpCode(StatusCodes.CREATED)
  async register(@Body() body: RegisterDTO) {
    return this.authService.register(body)
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const refreshToken = req?.cookies['refreshToken']
    const payload: any = this.authService['jwtService'].decode(refreshToken)
    console.log(payload)
    return this.authService.refreshToken(payload.id, refreshToken)
  }

  @Post('logout')
  async logout() {}
}
