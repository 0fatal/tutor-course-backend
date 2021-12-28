import { ErrorDefine } from './base'

export interface ErrorType {
  'course-instance': {
    COURSE_INSTANCE_NOT_FOUND: {}
    UPDATE_COURSE_INSTANCE_ERROR: {}
    CREATE_COURSE_INSTANCE_ERROR: {}
    DELETE_COURSE_INSTANCE_ERROR: {}
  }
}

export const CourseInstanceErrorMap: ErrorDefine<'course-instance', ErrorType> =
  {
    COURSE_INSTANCE_NOT_FOUND: {
      code: 400201,
      msg: '课程实例不存在',
    },
    UPDATE_COURSE_INSTANCE_ERROR: {
      code: 400202,
      msg: '更新课程实例失败',
    },
    CREATE_COURSE_INSTANCE_ERROR: {
      code: 400203,
      msg: '创建课程实例失败',
    },
    DELETE_COURSE_INSTANCE_ERROR: {
      code: 400203,
      msg: '删除课程实例失败',
    },
  }
