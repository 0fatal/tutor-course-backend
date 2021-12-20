import { RuleType } from '@midwayjs/decorator/dist/annotation/rule'
import { Rule } from '@midwayjs/decorator'
import { CourseState } from '../../entity/course'

export class UpdateCourseDTO {
  @Rule(RuleType.string().required().length(36))
  courseId: string

  @Rule(RuleType.string().optional())
  courseNum: string

  @Rule(RuleType.string().optional())
  courseName: string

  @Rule(RuleType.number().optional())
  beginYear: number

  @Rule(RuleType.number().optional())
  endYear: number

  @Rule(RuleType.number().optional())
  credit: number
}

export class NewCourseDTO {
  @Rule(RuleType.string().min(6).max(10).required())
  courseNum: string

  @Rule(RuleType.string().max(32).required())
  courseName: string

  @Rule(RuleType.number().required())
  beginYear: number

  @Rule(RuleType.number().required())
  endYear: number

  @Rule(RuleType.number().required())
  credit: number
}

export class UpdateCourseState {
  @Rule(RuleType.string().required().length(36))
  courseId: string

  @Rule(RuleType.number().integer().min(0).max(1))
  courseState: CourseState
}
