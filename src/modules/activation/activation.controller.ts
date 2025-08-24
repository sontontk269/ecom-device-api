import { ActivationService } from '@modules/activation/activation.service'
import { Body, Controller, Get, Post, Query } from '@nestjs/common'

@Controller('activation')
export class ActivationController {
  constructor(private readonly activationService: ActivationService) {}

  @Get()
  async activate(@Query('token') token: string) {
    return this.activationService.activate(token)
  }

  @Post('resend')
  async resend(@Body() email: string) {
    return this.activationService.resend(email)
  }
}
