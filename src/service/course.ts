import { Provide } from '@midwayjs/decorator'
import { Repository } from 'typeorm'
import { Course } from '../entity/course'
import { InjectEntityModel } from '@midwayjs/orm'
import { ErrorType } from '../errorType/base'
import { CourseErrorMap } from '../errorType/course'

@Provide()
export class CourseService {
  @InjectEntityModel(Course)
  courseRepository: Repository<Course>

  async findByCourseId(courseId: string): Promise<Course> {
    return await this.courseRepository.findOne(courseId)
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find()
  }

  async update(course: Course): Promise<boolean> {
    try {
      await this.courseRepository.update(course.id, course)
    } catch (e: any) {
      throw ErrorType.wrap(CourseErrorMap['UPDATE_COURSE_ERROR'], e)
    }
    return true
  }
}
