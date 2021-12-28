import { IMidwayWebNext, IWebMiddleware } from '@midwayjs/web'
import { Context } from 'egg'
import { Provide } from '@midwayjs/decorator'
import { R } from '../utils/response'
import { ErrorType } from '../errorType/base'

@Provide()
export class ErrorMiddleware implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      try {
        await next()
      } catch (err) {
        console.error(err)
        if (ErrorType.is(err)) {
          ctx.body = err
          ctx.status = 200
          return
        }
        if (err?.details?.[0].type === 'any.required') {
          ctx.status = 200
          ctx.body = R.Fail().Msg(err.message)
        } else {
          ctx.body = {
            msg: err.message,
            code: err.code,
          }
          ctx.status = err.status || 500
        }
      }
    }
  }
}
