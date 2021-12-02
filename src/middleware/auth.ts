import { IMidwayWebNext, IWebMiddleware } from '@midwayjs/web'
import { Context } from 'egg'
import { Teacher } from '../entity/teacher'
import { R } from '../utils/response'
import { Provide } from '@midwayjs/decorator'
import { ErrorMap } from '../errorType/base'

@Provide()
export class AuthMiddleware implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      if (ctx.path === '/teacher/login' || ctx.path === '/teacher/registry')
        return await next()
      const teacher = ctx.session.teacher as Teacher
      if (!teacher) {
        ctx.body = R.WrapError(ErrorMap['UNAUTHORIZED'])
        ctx.status = 200
        return
      }
      ctx['teacher'] = teacher
      await next()
    }
  }
}
