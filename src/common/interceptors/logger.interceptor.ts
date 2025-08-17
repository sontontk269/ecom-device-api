import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import chalk from 'chalk'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const { method, url } = req
    const now = Date.now()

    const getVNTime = () =>
      new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false
      })

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now
        const logMsg = `${getVNTime()} - ${method} - 200 - Success (${duration}ms) - ${url}`

        this.logger.log(chalk.green(logMsg))
      }),
      catchError(err => {
        const duration = Date.now() - now
        const statusCode = err.status || 500
        const logMsg = `${getVNTime()} - ${method} - ${statusCode} - ${err.message} (${duration}ms) - ${url}`

        this.logger.error(chalk.red(logMsg))
        return throwError(() => err)
      })
    )
  }
}
