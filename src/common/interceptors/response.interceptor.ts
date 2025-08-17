import ApiResponse from '@common/utils/api-response'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(data => {
        //Keep if data was ApiResponse
        if (data instanceof ApiResponse) return data
        return ApiResponse.success(data)
      })
    )
  }
}
