import { RuleType } from '@midwayjs/decorator/dist/annotation/rule'
import { Rule } from '@midwayjs/decorator'

export class UpdateCourseDTO {
  @Rule(RuleType.string().required().length(36))
  courseId: string

  @Rule(RuleType.string().optional())
  courseNum: string

  @Rule(RuleType.string().optional())
  courseName: string
}

export class NewCourseDTO {
  @Rule(RuleType.string().min(6).max(10).required())
  courseNum: string

  @Rule(RuleType.string().max(32).required())
  courseName: string
}
