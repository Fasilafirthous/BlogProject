import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, take, timeout } from 'rxjs/operators';
// import {config as configData} from '../../config/config'
// const config = configData[process.env.NODE_ENV || 'development'];

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const timeoutValue = 20000; // set the timeout to 20 seconds (20000 milliseconds)
        return next.handle().pipe(
            timeout(timeoutValue),
            catchError(err => {
                if (err instanceof TimeoutError) {
                    return throwError(() => new RequestTimeoutException());
                }
                return throwError(() => err);
            }),
        );
    }
}