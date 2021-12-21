import { Rule } from '@midwayjs/decorator'
import { RuleType } from '@midwayjs/decorator/dist/annotation/rule'

export class NewTemplateInstanceDTO {
  @Rule(RuleType.string().length(36))
  templateId: string

  @Rule(RuleType.object())
  tags: any

  @Rule(RuleType.optional())
  staffId: string

  @Rule(RuleType.string().min(2).max(64))
  name: string

  @Rule(RuleType.string().length(36))
  courseId: string

  @Rule(RuleType.string().optional().length(36))
  excelId: string
}

export class UpdateTemplateInstanceDTO {
  @Rule(RuleType.string().length(36))
  id: string

  @Rule(RuleType.object())
  tags: any

  @Rule(RuleType.string().length(36).allow(null))
  excelId: string | null

  @Rule(RuleType.string().optional().min(2).max(64))
  name: string
}

export class QueryTemplateInstanceDTO {
  id: string
  template: {
    templateId: string
    templateName: string
  }
  course: {
    courseName: string
    courseId: string
  }
  excel: {
    id: string
    name: string
  } | null
  name: string
  updateAt: Date
}

export class CopyTemplateInstance {
  @Rule(RuleType.string().min(2).max(64))
  name: string

  @Rule(RuleType.string().length(36))
  courseId: string

  @Rule(RuleType.string().length(36))
  instanceId: string
}
