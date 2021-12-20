import { EntityModel } from '@midwayjs/orm'
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@EntityModel('template_instance')
export class TemplateInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  templateId: string

  @Column({ type: 'text' })
  tags: string

  @Column()
  staffId: string

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date

  @Column({ type: 'varchar', length: 36 })
  courseId: string

  @Column({ type: 'varchar', length: 36 })
  excelId: string

  @Column({ type: 'varchar', length: 64 })
  name: string
}
