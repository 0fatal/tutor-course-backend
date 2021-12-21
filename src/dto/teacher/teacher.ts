import { Rule } from '@midwayjs/decorator'
import { RuleType } from '@midwayjs/decorator/dist/annotation/rule'

export class RegistryTeacherDTO {
  @Rule(RuleType.string().min(2).max(6).required())
  name: string

  @Rule(RuleType.string().min(6).max(20).required())
  password: string

  @Rule(RuleType.string().min(5).max(8).required())
  staffId: string
}

export class UpdateTeacherDTO {
  @Rule(RuleType.string().min(2).max(6).required())
  name: string
}

export class LoginDTO {
  @Rule(RuleType.string().min(6).max(20).required())
  password: string

  @Rule(RuleType.string().min(5).max(8).required())
  staffId: string
}

export class UpdatePasswordDTO {
  @Rule(RuleType.forbidden())
  staffId: string

  @Rule(RuleType.string().min(6).max(20).required())
  password: string

  @Rule(RuleType.string().min(6).max(20).required())
  oldPassword: string

  @Rule(
    RuleType.equal(RuleType.ref('password'))
      .required()
      .messages({ 'any.only': "password aren't the same" })
  )
  checkPass: string
}
