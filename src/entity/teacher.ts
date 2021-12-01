import { EntityModel } from '@midwayjs/orm'
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

@EntityModel('teacher')
export class Teacher {
  @PrimaryColumn()
  staffId: string

  @Column()
  name: string

  @Column()
  password: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt?: Date

  @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
  updateAt?: Date

  @Column({ type: 'tinyint' })
  isAdmin: number
}
