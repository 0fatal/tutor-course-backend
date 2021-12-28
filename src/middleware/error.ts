import { IMidwayWebNext, IWebMiddleware } from '@midwayjs/web'
import { Context } from 'egg'
import { Provide } from '@midwayjs/decorator'
import { R } from '../utils/response'

@Provide()
export class ErrorMiddleware implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      try {
        await next()
      } catch (err) {
        console.error(err)
        if (err?.details?.[0].type === 'any.required') {
          ctx.status = 200
          ctx.body = R.Fail().Msg(err.message)
        } else {
          ctx.body = {
            message: err.message,
            code: err.code,
            stack: err.stack,
          }
          ctx.status = err.status || 500
        }
      }
    }
  }
}
