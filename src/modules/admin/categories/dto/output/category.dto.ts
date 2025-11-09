import { Type } from 'class-transformer'

export class CategoryDTO {
  id: number
  name: string
  description?: string | null
  imageUrl?: string | null
  isActive: boolean
  sortOrder: number
  parentId?: number | null

  @Type(() => SimpleCategory)
  parent?: SimpleCategory | null

  createdAt: Date
  updatedAt: Date

  @Type(() => SimpleCategory)
  children?: SimpleCategory[]
}

export class SimpleCategory {
  id: number
  name: string
}
