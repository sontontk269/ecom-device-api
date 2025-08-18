import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    super()
  }

  async onModuleInit() {
    try {
      await this.$connect()
      this.logger.info('✅ Connected to PostgreSQL successfully ')
    } catch (error) {
      this.logger.error(`❌ Failed to connect to PostgreSQL: ${error.message}`)
      throw new InternalServerErrorException()
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.warn(' Disconnected from PostgreSQL')
  }
}
