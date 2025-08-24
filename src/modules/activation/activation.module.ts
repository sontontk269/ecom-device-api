import { Module } from '@nestjs/common'
import { EmailModule } from '@modules/email/email.module'
import { ActivationController } from './activation.controller'
import { ActivationService } from './activation.service'

@Module({
  imports: [EmailModule],
  controllers: [ActivationController],
  providers: [ActivationService],
  exports: [ActivationService]
})
export class ActivationModule {}
