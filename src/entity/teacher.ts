import { EntityModel } from '@midwayjs/orm'
import { Column, PrimaryColumn } from 'typeorm'

@EntityModel('teacher')
export class Teacher {
  @PrimaryColumn()
  tid: string

  @Column()
  name: string

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  createAt: Date

  @Column()
  updateAt: Date

  @Column()
  isAdmin: boolean
}
