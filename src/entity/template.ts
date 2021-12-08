import { EntityModel } from '@midwayjs/orm'
import { Column, PrimaryColumn } from 'typeorm'

@EntityModel('template')
export class Template {
  @PrimaryColumn()
  fid: string

  @Column()
  filename: string
  @Column()
  path: string
  @Column()
  createAt: Date
  @Column()
  courseId: string
}
