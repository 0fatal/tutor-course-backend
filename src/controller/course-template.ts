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
  async listCourseTemplate(@Query('m') manage: string): Promise<R> {
    const list = await this.courseTemplateService.listCourseTemplate(
      !!manage && !!this.ctx.teacher.isAdmin
    )
    return R.Ok().Data(list)
  }

  @Get('/:cid')
  async getCourseTemplate(@Param('cid') courseTemplateId: string): Promise<R> {
    const courseTemplate = await this.courseTemplateService.getCourseTemplate(
      courseTemplateId
    )
    return courseTemplate
      ? R.Ok().Data(courseTemplate)
      : R.WrapError(CourseTemplateErrorMap.COURSE_NOT_FOUND)
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
