import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'secretKey',
  expiresIn: '1d', // access token
  refreshExpiresIn: '7d' // refresh token
}))
