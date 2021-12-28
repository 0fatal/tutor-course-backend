import { Rule, RuleType } from '@midwayjs/decorator'
import { CourseState } from '../../entity/course'

export class CreateCourseTemplateDTO {
  @Rule(RuleType.string().min(2).max(20).required())
  courseName: string

  @Rule(RuleType.number().required())
  credit: number

  @Rule(RuleType.string().min(5).max(10).required())
  courseCode: string
}

export class UpdateCourseTemplateDTO {
  @Rule(RuleType.string().required().length(36))
  courseId: string

  @Rule(RuleType.string().min(2).max(20).optional())
  courseName: string

  @Rule(RuleType.number().optional())
  credit: number

  @Rule(RuleType.string().min(5).max(10).optional())
  courseCode: string

  @Rule(RuleType.number().integer().min(0).max(1).optional())
  courseState: CourseState
}
