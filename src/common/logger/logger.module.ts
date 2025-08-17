import { Module } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from './logger.config'

@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  exports: [WinstonModule] // export để các module khác dùng được
})
export class LoggerModule {}
