import { Column, PrimaryGeneratedColumn } from 'typeorm'
import { EntityModel } from '@midwayjs/orm'

@EntityModel('course_nature')
export class CourseNature {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number

  @Column({ unique: true, nullable: false, type: 'varchar', length: 32 })
  name: string
}
