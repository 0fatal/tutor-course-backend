// import { Teacher } from '../entity/teacher'
// import { R } from './response'
// import { ErrorMap } from '../errorType/base'

// export function MustAdmin(target: any, propertyName: string, descriptor: any) {
//   const method = descriptor.value
//   descriptor.value = function (...args: any[]) {
//     const teacher = this.ctx['teacher'] as Teacher
//     console.log(teacher)
//     if (!teacher) throw R.WrapError(ErrorMap['UNAUTHORIZED'])
//     if (teacher.isAdmin === 1) {
//       this.ctx.status = 403
//       return R.WrapError(ErrorMap['REQUEST_FORBIDDEN'])
//     }
//     // eslint-disable-next-line prefer-rest-params
//     return method.apply(this, args)
//   }
// }
