import {
  ALL,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Provide,
  Validate,
} from '@midwayjs/decorator'
import { Context } from '@midwayjs/web'
import { CourseService } from '../service/course'
import { R } from '../utils/response'
import { NewCourseDTO, UpdateCourseState } from '../dto/course/course'

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

  @Post('/')
  async newCourse(@Body(ALL) course: NewCourseDTO): Promise<R> {
    await this.courseService.newCourse(course)
    return R.Ok()
  }

  @Validate()
  @Patch('/state')
  async updateCourseState(@Body(ALL) data: UpdateCourseState): Promise<R> {
    const ok = this.courseService.updateCourseState(data)
    return ok ? R.Ok() : R.Fail()
  }
}
