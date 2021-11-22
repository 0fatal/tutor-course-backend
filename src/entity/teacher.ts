import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryColumn } from 'typeorm';

@EntityModel('teacher')
export class Teacher {
  @PrimaryColumn()
  staffId: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;

  @Column()
  isAdmin: boolean;
}
