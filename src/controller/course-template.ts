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
import { CourseTemplateService } from '../service/course-template'
import {
  CreateCourseTemplateDTO,
  UpdateCourseTemplateDTO,
} from '../dto/courseTemplate/course-template'
import { CourseTemplateErrorMap } from '../errorType/course-template'

@Provide()
@Controller('/course_template')
export class CourseTemplateController {
  @Inject()
  ctx: Context

  @Inject()
  courseTemplateService: CourseTemplateService

  @Patch('/', { middleware: ['mustAdmin'] })
  @Validate()
  async updateCourseTemplate(
    @Body(ALL) data: UpdateCourseTemplateDTO
  ): Promise<R> {
    await this.courseTemplateService.updateCourseTemplate(data)
    return R.Ok()
  }

  @Get('/')
  async listCourseTemplate(): Promise<R> {
    const list = await this.courseTemplateService.listCourseTemplate(
      !!this.ctx.teacher.isAdmin
    )
    return R.Ok().Data(list)
  }

  @Post('/', { middleware: ['mustAdmin'] })
  @Validate()
  async newCourseTemplate(
    @Body(ALL) course: CreateCourseTemplateDTO
  ): Promise<R> {
    const ok = await this.courseTemplateService.createCourseTemplate(course)
    return ok ? R.Ok() : R.WrapError(CourseTemplateErrorMap.CREATE_FAILED)
  }

  @Del('/:cid', { middleware: ['mustAdmin'] })
  async removeCourseTemplate(
    @Param('cid') courseTemplateId: string
  ): Promise<R> {
    const ok = await this.courseTemplateService.removeCourseTemplate(
      courseTemplateId
    )
    return ok ? R.Ok() : R.WrapError(CourseTemplateErrorMap.DELETE_FAILED)
  }
}
