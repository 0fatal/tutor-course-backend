import { TeacherService } from '../service/teacher'
import {
  ALL,
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Provide,
  Query,
  Validate,
} from '@midwayjs/decorator'
import { R } from '../utils/response'
import { Context } from 'egg'
import {
  AdminUpdateTeacherDTO,
  LoginDTO,
  RegistryTeacherDTO,
  UpdatePasswordDTO,
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

  @Get('/list', { middleware: ['mustAdmin'] })
  async listTeacher() {
    const teachers = await this._teacherService.getTeacherList()
    return R.Ok().Data(teachers)
  }

  @Post('/forbidden/:tid', { middleware: ['mustAdmin'] })
  async changeForbiddenStatus(
    @Param('tid') tid,
    @Query('f') isForbidden: string
  ): Promise<R> {
    const ok = await this._teacherService.changeForbiddenStatus(
      tid,
      isForbidden === '1'
    )
    return ok ? R.Ok() : R.Fail()
  }

  @Patch('/')
  @Validate()
  async setInfo(ctx: Context, @Body(ALL) data: UpdateTeacherDTO): Promise<R> {
    const staffId = ctx['teacher'].staffId
    const ok = await this._teacherService.updateInfo(staffId, data)
    if (!ok) return R.Fail().Msg('update info fail')
    return R.Ok()
  }

  @Patch('/info', { middleware: ['mustAdmin'] })
  @Validate()
  async adminSetInfo(@Body(ALL) data: AdminUpdateTeacherDTO): Promise<R> {
    const ok = await this._teacherService.adminUpdateInfo(data)
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

  @Get('/info/:tid', { middleware: ['mustAdmin'] })
  async getTeacherInfo(@Param('tid') staffId: string): Promise<R> {
    const teacher = await this._teacherService.findByStaffId(staffId)
    if (!teacher) return R.WrapError(TeacherErrorMap['NOT_FOUND'])

    return R.Ok().Data(teacher)
  }

  @Del('/:tid', { middleware: ['mustAdmin'] })
  async deleteTeacher(@Param('tid') staffId: string): Promise<R> {
    const ok = await this._teacherService.delete(staffId)
    return ok ? R.Ok() : R.Fail()
  }

  @Post('/registry', { middleware: ['mustAdmin'] })
  @Validate()
  async registry(@Body(ALL) data: RegistryTeacherDTO): Promise<R> {
    const [ok, err] = await this._teacherService.registry(data)
    if (!ok) return R.Fail().Msg(err || 'registry fail')
    return R.Ok()
  }

  @Post('/password/change')
  @Validate()
  async changePassword(@Body(ALL) data: UpdatePasswordDTO): Promise<R> {
    data.staffId = this.ctx['teacher'].staffId
    const [ok, err] = await this._teacherService.changePassword(data)
    if (!ok) return R.Fail().Msg(err.message || 'change password fail')
    return R.Ok()
  }

  @Post('/logout')
  async logout() {
    this.ctx.session.teacher = null
    return R.Ok()
  }
}
