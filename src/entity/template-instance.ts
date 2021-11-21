import { EntityModel } from '@midwayjs/orm'
import { Column, PrimaryColumn } from 'typeorm'

@EntityModel('template_instance')
export class TemplateInstance {
  @PrimaryColumn()
  id: string

  @Column()
  type: number

  @Column()
  templateId: string

  @Column()
  createAt: Date

  @Column()
  updateAt: Date
}
