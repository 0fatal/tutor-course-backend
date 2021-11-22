import { TemplateType } from '../../service/template-instance';

export interface NewTemplateInstanceDTO {
  type: TemplateType;
  templateId: string;
  staffId: string;
  tags: any;
}

export interface UpdateTemplateInstanceDTO {
  id: string;
  tags: any;
}
