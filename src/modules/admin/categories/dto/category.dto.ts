// dto/category.dto.ts
export class CategoryDTO {
  id: number
  name: string
  description?: string | null
  imageUrl?: string | null
  isActive: boolean
  sortOrder: number
  parentId?: number | null
  parent?: {
    id: number
    name: string
  } | null
  createdAt: Date
  updatedAt: Date
  children?: {
    id: number
    name: string
  }[]
}
