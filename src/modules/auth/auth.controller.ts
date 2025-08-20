import { AuthService } from '@modules/auth/auth.service'
import { LoginDTO, RegisterDTO } from '@modules/auth/dto'
import { Body, Controller, Post, Res } from '@nestjs/common'
import type { Response } from 'express'

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
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
  async register(@Body() body: RegisterDTO) {
    return this.authService.register(body)
  }
}
