export class UserEntity {
  id: number
  email: string
  fullName: string
  role: string
  createdAt: Date

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }

  //hide password
  static pickUser(user: any): UserEntity {
    const { password, ...rest } = user
    return new UserEntity(rest)
  }
}
