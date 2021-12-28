import { RuleType } from '@midwayjs/decorator/dist/annotation/rule'
import { Rule } from '@midwayjs/decorator'
import { CourseInstance } from '../../entity/course-instance'
import { CourseTemplate } from '../../entity/course-template'

export class UpdateCourseInstanceDTO {
  @Rule(RuleType.string().length(36).required())
  instanceId: string

  @Rule(RuleType.string().min(3).max(20).required())
  classroom: string

  @Rule(RuleType.string().min(3).max(20).required())
  classTime: string

  @Rule(RuleType.number().required())
  beginYear: number

  @Rule(RuleType.number().required())
  endYear: number

  @Rule(RuleType.number().required())
  semester: number
}

export class NewCourseInstanceDTO {
  @Rule(RuleType.string().length(36).required())
  courseId: string

  @Rule(RuleType.string().min(3).max(20).required())
  classroom: string

  @Rule(RuleType.string().min(3).max(20).required())
  classTime: string

  @Rule(RuleType.forbidden())
  staffId: string

  @Rule(RuleType.number().required())
  beginYear: number

  @Rule(RuleType.number().required())
  endYear: number

  @Rule(RuleType.number().required())
  semester: number
}

export type QueryCourseInstanceDTO = Pick<
  CourseInstance,
  | 'instanceId'
  | 'courseId'
  | 'classroom'
  | 'classTime'
  | 'beginYear'
  | 'endYear'
  | 'semester'
> &
  Pick<
    CourseTemplate,
    | 'courseName'
    | 'credit'
    | 'courseCode'
    | 'courseNature'
    | 'createAt'
    | 'updateAt'
  >
