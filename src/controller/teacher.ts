import { TeacherService } from '../service/teacher'
import {
  ALL,
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Provide,
  Validate,
} from '@midwayjs/decorator'
import { R } from '../utils/response'
import { Context } from 'egg'
import {
  LoginDTO,
  RegistryTeacherDTO,
  UpdateTeacherDTO,
} from '../dto/teacher/teacher'
import { TeacherErrorMap } from '../errorType/teacher'

@Provide()
@Controller('/teacher')
export class TeacherController {
  @Inject()
  _teacherService: TeacherService

  @Inject()
  ctx: Context

  @Post('/login')
  @Validate()
  async login(@Body(ALL) data: LoginDTO): Promise<R> {
    const { staffId, password } = data
    const teacher = await this._teacherService.getByStaffIdAndPassword(
      staffId,
      password
    )

    if (!teacher) return R.WrapError(TeacherErrorMap['LOGIN_FAILED'])

    this.ctx.session.teacher = teacher
    return R.Ok().Msg('login success')
  }

  @Patch('/')
  @Validate()
  async setInfo(ctx: Context, @Body(ALL) data: UpdateTeacherDTO): Promise<R> {
    const staffId = ctx['teacher'].staffId
    const ok = await this._teacherService.updateInfo(staffId, data)
    if (!ok) return R.Fail().Msg('update info fail')
    return R.Ok()
  }

  @Get('/')
  async getInfo(ctx: Context): Promise<R> {
    const staffId = ctx['teacher'].staffId
    const teacher = await this._teacherService.findByStaffId(staffId)
    if (!teacher) return R.WrapError(TeacherErrorMap['LOGIN_FAILED'])

    return R.Ok().Data(teacher)
  }

  @Post('/registry')
  @Validate()
  async registry(@Body(ALL) data: RegistryTeacherDTO): Promise<R> {
    const [ok, err] = await this._teacherService.registry(data)
    if (!ok) return R.Fail().Msg(err ?? 'registry fail')
    return R.Ok()
  }
}
