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

  @Column({ type: 'tinyint' })
  type: number // 0: docx 1:excel

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
}
