import { Type } from 'class-transformer'
import { IsString, IsOptional, IsInt, IsBoolean, Min } from 'class-validator'

export class CreateCategoryInputDTO {
  @IsString()
  name: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  parentId?: number

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  imageUrl?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number
}
