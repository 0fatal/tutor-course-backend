import { EntityModel } from '@midwayjs/orm'
import { Column, PrimaryColumn } from 'typeorm'

@EntityModel('template')
export class Template {
  @PrimaryColumn()
  tid: string

  @Column()
  templateName: string

  @Column()
  filepath: string

  @Column()
  createAt: Date

  @Column()
  type: number
}
