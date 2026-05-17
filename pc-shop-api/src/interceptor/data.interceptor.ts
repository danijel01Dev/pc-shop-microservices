import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => this.removePassword(data)));
  }

  private removePassword(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.removePassword(item));
    }

    if (data instanceof Date) {
      return data;
    }

    if (data && typeof data === 'object') {
      const result: any = {};

      for (const key in data) {
        if (key === 'password') continue;

        result[key] = this.removePassword(data[key]);
      }

      return result;
    }
    return data;
  }
}
