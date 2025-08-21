import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL || '',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  db: process.env.POSTGRES_DB || '',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10)
}))
