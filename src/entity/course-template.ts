import { EntityModel } from '@midwayjs/orm'
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

// CourseState 开课状态
// 0：未开课，1：开课
export enum CourseState {
  DISABLE = 0,
  ABLE = 1,
}

@EntityModel('course_template')
export class CourseTemplate {
  @PrimaryGeneratedColumn('uuid')
  courseTemplateId: string

  @Column()
  courseName: string

  @Column()
  credit: number

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: '课程号',
    unique: true,
  })
  courseCode: string

  @Column()
  courseState: CourseState

  @Column()
  courseNature: string

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date
}
