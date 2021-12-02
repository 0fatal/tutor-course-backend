import { ErrorDefine } from './base'

export interface ErrorType {
  teacher: {
    LOGIN_FAILED: {}
  }
}

export const TeacherErrorMap: ErrorDefine<'teacher', ErrorType> = {
  LOGIN_FAILED: {
    code: 400101,
    msg: '工号或密码错误',
  },
}
