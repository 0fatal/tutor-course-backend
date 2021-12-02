import { EntityModel } from '@midwayjs/orm'
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@EntityModel('course')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: '课程号',
    unique: true,
  })
  courseId: string

  @Column({ type: 'varchar', length: 32, nullable: false, comment: '课程名称' })
  courseName: string

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date
}
