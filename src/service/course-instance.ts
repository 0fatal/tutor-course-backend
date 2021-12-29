import { Provide } from '@midwayjs/decorator'
import { Repository } from 'typeorm'
import { InjectEntityModel } from '@midwayjs/orm'
import { ErrorType } from '../errorType/base'
import { CourseInstance } from '../entity/course-instance'
import {
  NewCourseInstanceDTO,
  QueryCourseInstanceDTO,
  UpdateCourseInstanceDTO,
} from '../dto/courseInstance/courseInstance'
import { CourseTemplate } from '../entity/course-template'
import { CourseInstanceErrorMap } from '../errorType/course-instance'

@Provide()
export class CourseInstanceService {
  @InjectEntityModel(CourseInstance)
  courseInstanceRepository: Repository<CourseInstance>
  @InjectEntityModel(CourseTemplate)
  courseTemplateRepository: Repository<CourseTemplate>

  async findByInstanceId(instanceId: string): Promise<QueryCourseInstanceDTO> {
    const data = await this.courseInstanceRepository.findOne(instanceId)
    const { courseName, credit, courseCode, courseNature, createAt, updateAt } =
      await this.courseTemplateRepository.findOne(data.courseTemplateId)
    const result: QueryCourseInstanceDTO = {
      ...data,
      courseName,
      credit,
      courseCode,
      courseNature,
      createAt,
      updateAt,
    }
    return result
  }

  async findAll(staffId: string): Promise<QueryCourseInstanceDTO[]> {
    const data = await this.courseInstanceRepository.find({
      select: [
        'courseTemplateId',
        'courseId',
        'classroom',
        'classTime',
        'beginYear',
        'endYear',
        'semester',
        'classNum',
      ],
      where: {
        staffId,
      },
    })

    const result: QueryCourseInstanceDTO[] = []
    for (const item of data) {
      const {
        courseName,
        credit,
        courseCode,
        courseNature,
        createAt,
        updateAt,
      } = await this.courseTemplateRepository.findOne(item.courseTemplateId)
      result.push({
        ...item,
        courseName,
        credit,
        courseCode,
        courseNature,
        createAt,
        updateAt,
      })
    }
    return result
  }

  async update(course: UpdateCourseInstanceDTO): Promise<boolean> {
    try {
      await this.courseInstanceRepository.update(course.courseId, course)
    } catch (e: any) {
      throw ErrorType.wrap(
        CourseInstanceErrorMap['UPDATE_COURSE_INSTANCE_ERROR'],
        e.message
      )
    }
    return true
  }

  async removeCourse(instanceId: string): Promise<boolean> {
    try {
      await this.courseInstanceRepository.delete(instanceId)
    } catch (e: any) {
      throw ErrorType.wrap(
        CourseInstanceErrorMap['DELETE_COURSE_INSTANCE_ERROR'],
        e.message
      )
    }
    return true
  }

  async newCourse(course: NewCourseInstanceDTO): Promise<boolean> {
    try {
      const newCourse = this.courseInstanceRepository.create(course)
      await this.courseInstanceRepository.insert(newCourse)
    } catch (e) {
      throw ErrorType.wrap(
        CourseInstanceErrorMap['CREATE_COURSE_INSTANCE_ERROR'],
        '课程实例已存在，只能编辑'
      )
    }
    return true
  }
}
