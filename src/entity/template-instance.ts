import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('template_instance')
export class TemplateInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: number; // 0: docx 1:excel

  @Column()
  templateId: string;

  @Column()
  tags: string;

  @Column()
  staffId: string;

  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;
}
