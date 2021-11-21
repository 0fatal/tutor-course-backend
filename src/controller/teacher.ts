import { TeacherService } from '../service/teacher';
import {
  ALL,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
} from '@midwayjs/decorator';
import { R } from '../utils/response';

@Provide()
@Controller('/teacher')
export class TeacherController {
  @Inject()
  _teacherService: TeacherService;

  @Post('/login')
  async login(@Body(ALL) data: any): Promise<R> {
    const { username, password } = data;
    const teacher = await this._teacherService.getByUsernameAndPassword(
      username,
      password
    );

    if (!teacher) return R.Fail().Msg('wrong username or password');

    sessionStorage.setItem('teacher', JSON.stringify(teacher));
    return R.Ok().Msg('login success');
  }

  @Get('/')
  async getInfo(): Promise<R> {
    const tid = JSON.parse(sessionStorage.getItem('teacher'));
    const teacher = await this._teacherService.findByTid(tid);
    if (!teacher) return R.Fail().Msg('need login');

    return R.Ok().Data(teacher);
  }
}
