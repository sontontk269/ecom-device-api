import { Type } from 'class-transformer'

export class AddressDTO {
  id: number
  fullName: string
  phone: string
  city: string
  district: string
  ward: string
  country: string
  isDefault: boolean
}

export class UserDTO {
  id: number
  fullName: string
  email: string
  phone?: string | null
  status: string
  avatar?: string | null
  createdAt: Date
  updatedAt: Date

  @Type(() => AddressDTO)
  addresses?: AddressDTO[]
}
