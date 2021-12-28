import { EntityModel } from '@midwayjs/orm'
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@EntityModel('course_template')
export class CourseTemplate {
  @PrimaryGeneratedColumn('uuid')
  courseId: string

  @Column()
  courseName: string

  @Column()
  credit: number

  @Column()
  courseCode: string

  @Column()
  courseState: number

  @Column()
  courseNature: string

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date
}
