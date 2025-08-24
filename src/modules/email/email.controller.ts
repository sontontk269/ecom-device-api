import { Controller, Post, Body } from '@nestjs/common'
import { EmailService } from './email.service'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test-welcome')
  async sendWelcome(@Body('to') to: string) {
    return this.emailService.sendWelcomeEmail(to)
  }

  @Post('test-activation')
  async sendActivation(@Body('to') to: string, @Body('token') token: string) {
    return this.emailService.sendActivationEmail(to, token)
  }
}
