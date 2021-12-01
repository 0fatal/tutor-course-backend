import { IMidwayWebNext, IWebMiddleware } from '@midwayjs/web'
import { Context } from 'egg'
import { Teacher } from '../entity/teacher'
import { ErrorType } from '../utils/errorType'
import { R } from '../utils/response'
import { Provide } from '@midwayjs/decorator'

@Provide()
export class AuthMiddleware implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      if (ctx.path === '/teacher/login' || ctx.path === '/teacher/registry')
        return await next()
      const teacher = ctx.session.teacher as Teacher
      if (!teacher) {
        ctx.body = R.WrapError(ErrorType.UNAUTHORIZED)
        ctx.status = 200
        return
      }
      ctx['teacher'] = teacher
      await next()
    }
  }
}
