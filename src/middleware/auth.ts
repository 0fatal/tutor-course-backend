import { IMidwayWebNext, IWebMiddleware } from '@midwayjs/web';
import { Context } from 'egg';
import { Teacher } from '../entity/teacher';

export class AuthMiddleware implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      const teacher = JSON.parse(sessionStorage.getItem('teacher')) as Teacher;
      ctx['teacher'] = teacher;
      await next();
    };
  }
}
