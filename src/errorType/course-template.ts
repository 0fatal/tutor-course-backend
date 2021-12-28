import { ErrorDefine } from './base'

export interface ErrorType {
  'course-template': {
    CREATE_FAILED: {}
    DELETE_FAILED: {}
    COURSE_NOT_FOUND: {}
  }
}

export const CourseTemplateErrorMap: ErrorDefine<'course-template', ErrorType> =
  {
    CREATE_FAILED: {
      code: 400301,
      msg: '创建课程模板失败',
    },
    DELETE_FAILED: {
      code: 400301,
      msg: '删除程模板失败',
    },
    COURSE_NOT_FOUND: {
      code: 400302,
      msg: '课程不存在',
    },
  }
