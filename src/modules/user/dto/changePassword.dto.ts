import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  oldPassword: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string
}
