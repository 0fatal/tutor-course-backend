import { EntityModel } from '@midwayjs/orm'
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

@EntityModel('course')
export class Course {
  @PrimaryColumn({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: '课程号',
  })
  courseId: string

  @Column({ type: 'varchar', length: 32, nullable: false, comment: '课程名称' })
  courseName: string

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date
}
