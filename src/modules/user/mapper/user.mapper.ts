import type { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { UserDTO, AddressDTO } from '../dto/ouput/user-profile.dto.js'

// Strongly typed user including related addresses loaded via Prisma include
// If you use select instead of include, adjust the payload type accordingly.
// Match the "select" shape used by service to avoid over-constraining payload
type UserWithAddresses = Prisma.UserGetPayload<{
  select: {
    id: true
    fullName: true
    email: true
    phone: true
    status: true
    avatar: true
    createdAt: true
    updatedAt: true
    addresses: {
      select: {
        id: true
        fullName: true
        phone: true
        city: true
        district: true
        ward: true
        country: true
        isDefault: true
      }
    }
  }
}>

export function toUserDTO(user: UserWithAddresses): UserDTO {
  const dto: UserDTO = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone ?? null,
    status: user.status,
    avatar: user.avatar ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    addresses:
      user.addresses?.map(
        (a): AddressDTO => ({
          id: a.id,
          fullName: a.fullName,
          phone: a.phone,
          city: a.city,
          district: a.district,
          ward: a.ward,
          country: a.country,
          isDefault: a.isDefault
        })
      ) ?? []
  }

  return plainToInstance(UserDTO, dto)
}
