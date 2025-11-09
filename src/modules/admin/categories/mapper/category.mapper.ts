import { plainToInstance } from 'class-transformer'
import type { Category } from '@prisma/client'
import { CategoryDTO, SimpleCategory } from '../dto/output/category.dto.js'

export function toCategoryDTO(
  category: Category & {
    parent?: Category | null
    children?: Category[]
  }
): CategoryDTO {
  const dto: CategoryDTO = {
    id: category.id,
    name: category.name,
    description: category.description,
    imageUrl: category.imageUrl,
    isActive: category.isActive,
    sortOrder: category.sortOrder,
    parentId: category.parentId ?? null,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    parent: category.parent
      ? {
          id: category.parent.id,
          name: category.parent.name
        }
      : null,
    children: (category.children ?? []).map<SimpleCategory>(c => ({ id: c.id, name: c.name }))
  }

  return plainToInstance(CategoryDTO, dto)
}
