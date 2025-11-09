import { User } from '@common/decorators'
import { JwtAuthGuard } from '@common/guards'
import { ChangePasswordValidation, UpdateUserValidation } from '@modules/user/dto'
import { UserService } from '@modules/user/user.service'
import { Body, Controller, Get, HttpCode, Patch, UseGuards } from '@nestjs/common'
import { StatusCodes } from 'http-status-codes'

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @HttpCode(StatusCodes.OK)
  async getProfile(@User() user: any) {
    return this.userService.getProfile(user.id)
  }

  @Patch('update-profile')
  @HttpCode(StatusCodes.OK)
  async updateProfile(@User() user: any, @Body() body: UpdateUserValidation) {
    return this.userService.updateProfile(user.id, body)
  }

  @Patch('change-password')
  @HttpCode(StatusCodes.OK)
  async changePassword(@User() user: any, @Body() body: ChangePasswordValidation) {
    return this.userService.changePassword(user.id, body.oldPassword, body.newPassword)
  }
}
