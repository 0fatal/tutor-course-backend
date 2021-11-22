import { TeacherService } from '../service/teacher';
import {
  ALL,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
  Validate,
} from '@midwayjs/decorator';
import { R } from '../utils/response';
import { ErrorType } from '../utils/errorType';
import { Context } from 'egg';
import { LoginDTO, RegistryTeacherDTO } from '../dto/teacher/teacher';

@Provide()
@Controller('/teacher')
export class TeacherController {
  @Inject()
  _teacherService: TeacherService;

  @Post('/login')
  @Validate()
  async login(@Body(ALL) data: LoginDTO): Promise<R> {
    const { staffId, password } = data;
    const teacher = await this._teacherService.getByStaffIdAndPassword(
      staffId,
      password
    );

    if (!teacher) return R.WrapError(ErrorType.UNAUTHORIZED);

    sessionStorage.setItem('teacher', JSON.stringify(teacher));
    return R.Ok().Msg('login success');
  }

  @Get('/')
  async getInfo(ctx: Context): Promise<R> {
    const staffId = ctx['teacher'].staffId;
    const teacher = await this._teacherService.findByStaffId(staffId);
    if (!teacher) return R.WrapError(ErrorType.UNAUTHORIZED);

    return R.Ok().Data(teacher);
  }

  @Post('/registry')
  @Validate()
  async registry(@Body(ALL) data: RegistryTeacherDTO): Promise<R> {
    const ok = await this._teacherService.registry(data);
    if (!ok) return R.Fail().Msg('registry fail');
    return R.Ok();
  }
}
