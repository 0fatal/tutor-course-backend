import { Provide } from '@midwayjs/decorator'
import { Repository } from 'typeorm'
import { InjectEntityModel } from '@midwayjs/orm'
import { CourseTemplate } from '../entity/course-template'
import {
  CreateCourseTemplateDTO,
  UpdateCourseTemplateDTO,
} from '../dto/courseTemplate/course-template'
import { ErrorType } from '../errorType/base'
import { CourseTemplateErrorMap } from '../errorType/course-template'

@Provide()
export class CourseTemplateService {
  @InjectEntityModel(CourseTemplate)
  private courseTemplateRepository: Repository<CourseTemplate>

  async listCourseTemplate(isAll = false): Promise<CourseTemplate[]> {
    const selectCondition: Partial<CourseTemplate> | undefined = isAll
      ? undefined
      : { courseState: 1 }
    const res = await this.courseTemplateRepository.find({
      where: selectCondition,
    })
    return res
  }

  async createCourseTemplate(data: CreateCourseTemplateDTO) {
    try {
      const courseTemplate = this.courseTemplateRepository.create(data)
      await this.courseTemplateRepository.insert(courseTemplate)
    } catch (e) {
      throw ErrorType.wrap(CourseTemplateErrorMap.CREATE_FAILED, e.message)
    }
    return true
  }

  async updateCourseTemplate(data: UpdateCourseTemplateDTO): Promise<boolean> {
    const course = await this.courseTemplateRepository.findOne(
      data.courseTemplateId
    )
    if (course) {
      return (
        (
          await this.courseTemplateRepository.update(
            data.courseTemplateId,
            data
          )
        ).affected === 1
      )
    }
    throw ErrorType.wrap(CourseTemplateErrorMap.COURSE_NOT_FOUND)
  }

  async removeCourseTemplate(courseTemplateId: string): Promise<boolean> {
    return (
      (await this.courseTemplateRepository.delete(courseTemplateId)).affected >
      0
    )
  }
}
