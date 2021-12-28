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
  Validate,
} from '@midwayjs/decorator'
import { Context } from '@midwayjs/web'
import { R } from '../utils/response'
import { CourseInstanceService } from '../service/course-instance'
import {
  NewCourseInstanceDTO,
  UpdateCourseInstanceDTO,
} from '../dto/courseInstance/courseInstance'

@Provide()
@Controller('/course')
export class CourseInstanceController {
  @Inject()
  ctx: Context

  @Inject()
  courseInstanceService: CourseInstanceService

  @Patch('/')
  @Validate()
  async updateCourse(@Body(ALL) data: UpdateCourseInstanceDTO): Promise<R> {
    await this.courseInstanceService.update(data)
    return R.Ok()
  }

  @Get('/')
  async listCourse(): Promise<R> {
    const list = await this.courseInstanceService.findAll(
      this.ctx.teacher.staffId
    )
    return R.Ok().Data(list)
  }

  @Get('/:cid')
  async getCourse(@Param('cid') cid: string): Promise<R> {
    const course = await this.courseInstanceService.findByInstanceId(cid)
    return R.Ok().Data(course)
  }

  @Post('/')
  @Validate()
  async newCourse(@Body(ALL) course: NewCourseInstanceDTO): Promise<R> {
    course.staffId = this.ctx.teacher.staffId
    await this.courseInstanceService.newCourse(course)
    return R.Ok()
  }

  @Del('/:cid')
  async removeCourse(@Param('cid') cid: string): Promise<R> {
    const course = await this.courseInstanceService.removeCourse(cid)
    return R.Ok().Data(course)
  }
}
