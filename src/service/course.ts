import { Provide } from '@midwayjs/decorator'
import { Repository } from 'typeorm'
import { Course } from '../entity/course'
import { InjectEntityModel } from '@midwayjs/orm'
import { ErrorType } from '../errorType/base'
import { CourseErrorMap } from '../errorType/course'
import { NewCourseDTO, UpdateCourseDTO } from '../dto/course/course'

@Provide()
export class CourseService {
  @InjectEntityModel(Course)
  courseRepository: Repository<Course>

  async findByCourseId(courseId: string): Promise<Course> {
    return await this.courseRepository.findOne(courseId)
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find({
      select: [
        'courseId',
        'courseNum',
        'courseName',
        'beginYear',
        'endYear',
        'credit',
        'courseState',
      ],
    })
  }

  async update(course: UpdateCourseDTO): Promise<boolean> {
    try {
      await this.courseRepository.update(course.courseId, course)
    } catch (e: any) {
      throw ErrorType.wrap(CourseErrorMap['UPDATE_COURSE_ERROR'], e.message)
    }
    return true
  }

  async newCourse(course: NewCourseDTO): Promise<boolean> {
    try {
      const newCourse = this.courseRepository.create(course)
      await this.courseRepository.save(newCourse)
    } catch (e) {
      throw ErrorType.wrap(CourseErrorMap['CREATE_COURSE_ERROR'], e.message)
    }
    return true
  }
}
