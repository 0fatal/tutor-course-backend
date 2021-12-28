import { EntityModel } from '@midwayjs/orm'
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@EntityModel('course_instance')
export class CourseInstance {
  @PrimaryGeneratedColumn('uuid')
  courseId: string

  @Column()
  courseTemplateId: string

  @Column({ comment: '教师', nullable: false })
  classroom: string

  @Column({ comment: '上课时间', nullable: false })
  classTime: string

  @Column()
  staffId: string

  @Column({ comment: '开始学年', nullable: false })
  beginYear: number

  @Column({ comment: '结束学年', nullable: false })
  endYear: number

  @Column({ comment: '学期', nullable: false })
  semester: number

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date
}
