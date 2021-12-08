import { ErrorDefine } from './base'

export interface ErrorType {
  course: {
    COURSE_NOT_FOUND: {}
    UPDATE_COURSE_ERROR: {}
    CREATE_COURSE_ERROR: {}
  }
}

export const CourseErrorMap: ErrorDefine<'course', ErrorType> = {
  COURSE_NOT_FOUND: {
    code: 400201,
    msg: '课程不存在',
  },
  UPDATE_COURSE_ERROR: {
    code: 400202,
    msg: '更新课程失败',
  },
  CREATE_COURSE_ERROR: {
    code: 400203,
    msg: '创建课程失败',
  },
}
