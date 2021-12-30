import { Provide } from '@midwayjs/decorator'
import { IMidwayWebNext, IWebMiddleware } from '@midwayjs/web'
import { Context } from 'egg'
import { Teacher } from '../entity/teacher'
import { R } from '../utils/response'
import { ErrorMap } from '../errorType/base'

@Provide()
export class MustAdmin implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      const teacher = ctx.session.teacher as Teacher
      if (!teacher) {
        ctx.body = R.WrapError(ErrorMap['UNAUTHORIZED'])
        ctx.status = 200
        return
      }

      if (!teacher.isAdmin) {
        ctx.body = R.WrapError(ErrorMap['REQUEST_FORBIDDEN'])
        ctx.status = 403
        return
      }
      await next()
    }
  }
}
