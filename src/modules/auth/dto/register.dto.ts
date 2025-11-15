import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator'

export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsString()
  @IsNotEmpty()
  fullName: string

  @Matches(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)
  @IsOptional()
  phone?: string
}
