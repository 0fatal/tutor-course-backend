import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Template } from '../entity/template';
import { Repository } from 'typeorm';
import { TemplateInstance } from '../entity/template-instance';

export enum TemplateType {
  DOCX,
  EXCEL,
}
@Provide()
export class TemplateInstanceService {
  @InjectEntityModel(Template)
  templateModel: Repository<Template>;

  @InjectEntityModel(TemplateInstance)
  templateInstanceModel: Repository<TemplateInstance>;

  async newInstance({
    templateId,
    tags,
    staffId,
    type,
  }: {
    templateId: string;
    tags: any;
    staffId: string;
    type: TemplateType;
  }): Promise<boolean> {
    const template = await this.templateModel.findOne(templateId);
    if (!template) {
      return false;
    }

    let instance = new TemplateInstance();
    instance = {
      ...instance,
      type,
      templateId,
      staffId,
      tags: JSON.stringify(tags),
    };
    await this.templateInstanceModel.create(instance);
    return true;
  }

  async delInstance(instanceId: string): Promise<true> {
    await this.templateInstanceModel.delete(instanceId);
    return true;
  }

  async updateInstance(instanceId: string, tags: any): Promise<true> {
    await this.templateInstanceModel.update(instanceId, {
      tags: JSON.stringify(tags),
    });
    return true;
  }

  async queryInstance(instanceId: string): Promise<TemplateInstance> {
    const instance = await this.templateInstanceModel.findOne(instanceId);
    return instance;
  }

  async getInstanceList(staffId: string): Promise<TemplateInstance[]> {
    const instances = await this.templateInstanceModel.find({
      where: {
        staffId,
      },
    });
    return instances;
  }

  async copyInstance(instanceId: string): Promise<true> {
    const instance = await this.templateInstanceModel.findOne(instanceId);
    await this.templateInstanceModel.create({
      ...instance,
      id: null,
    });
    return true;
  }
}
