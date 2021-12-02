import { TemplateType } from '../../service/template-instance'
import { Rule } from '@midwayjs/decorator'
import { RuleType } from '@midwayjs/decorator/dist/annotation/rule'

export class NewTemplateInstanceDTO {
  type: TemplateType

  @Rule(RuleType.string().length(36))
  templateId: string

  @Rule(RuleType.object())
  tags: any

  @Rule(RuleType.optional())
  staffId: string

  @Rule(RuleType.string().length(36))
  courseId: string
}

export class UpdateTemplateInstanceDTO {
  @Rule(RuleType.string().length(36))
  id: string

  @Rule(RuleType.object())
  tags: any

  @Rule(RuleType.options().string().length(36))
  courseId: string
}
