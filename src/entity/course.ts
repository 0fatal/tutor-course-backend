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

@EntityModel('course')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  courseId: string

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: '课程号',
    unique: true,
  })
  courseNum: string

  @Column({ type: 'varchar', length: 32, nullable: false, comment: '课程名称' })
  courseName: string

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date

  @Column()
  beginYear: number

  @Column()
  endYear: number

  // 学分
  @Column()
  credit: number

  @Column()
  courseState: CourseState
}
