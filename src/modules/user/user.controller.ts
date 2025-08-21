import { User } from '@common/decorators'
import { JwtAuthGuard } from '@common/guards'
import { UpdateUserDTO } from '@modules/user/dto'
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
  async updateProfile(@User() user: any, @Body() body: UpdateUserDTO) {
    return this.userService.updateProfile(user.id, body)
  }
}
