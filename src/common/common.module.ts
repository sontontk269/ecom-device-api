import { AdminInitService } from '@common/admin-init.service'
import { AllExceptionsFilter } from '@common/exceptions/all-exceptions.filter'
import { LoggerInterceptor } from '@common/interceptors/logger.interceptor'
import { ResponseInterceptor } from '@common/interceptors/response.interceptor'
import { Global, Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    AdminInitService
  ]
})
export class CommonModule {}
