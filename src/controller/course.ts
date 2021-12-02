import {
  ALL,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Provide,
} from '@midwayjs/decorator'
import { Context } from '@midwayjs/web'
import { CourseService } from '../service/course'
import { R } from '../utils/response'

@Provide()
@Controller('/course')
export class CourseController {
  @Inject()
  ctx: Context

  @Inject()
  courseService: CourseService

  @Patch('/')
  async updateCourse(@Body(ALL) data): Promise<R> {
    await this.courseService.update(data)
    return R.Ok()
  }

  @Get('/')
  async listCourse(): Promise<R> {
    const list = await this.courseService.findAll()
    return R.Ok().Data(list)
  }

  @Get('/:cid')
  async getCourse(@Param('cid') cid): Promise<R> {
    const course = await this.courseService.findByCourseId(cid)
    return R.Ok().Data(course)
  }
}
