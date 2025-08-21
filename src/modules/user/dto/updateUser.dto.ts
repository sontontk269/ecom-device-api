import { IsOptional, IsString, Matches } from 'class-validator'

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  fullName: string

  @Matches(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)
  @IsOptional()
  phone: string

  @IsOptional()
  avatar: string
}
