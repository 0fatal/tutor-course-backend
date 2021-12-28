import { ErrorDefine } from './base'

export interface ErrorType {
  teacher: {
    LOGIN_FAILED: {}
    LOGIN_FORBIDDEN: {}
    NOT_FOUND: {}
  }
}

export const TeacherErrorMap: ErrorDefine<'teacher', ErrorType> = {
  LOGIN_FAILED: {
    code: 400101,
    msg: '工号或密码错误',
  },
  LOGIN_FORBIDDEN: {
    code: 400102,
    msg: '该账号已被禁止登录',
  },
  NOT_FOUND: {
    code: 400103,
    msg: '该账号不存在',
  },
}
