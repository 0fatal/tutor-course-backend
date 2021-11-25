import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Template } from '../entity/template'
import { Repository } from 'typeorm'
import { TemplateInstance } from '../entity/template-instance'
import {
  NewTemplateInstanceDTO,
  UpdateTemplateInstanceDTO,
} from '../dto/templateInstance/template-instance'
import { loadDocxFile } from '../utils/doc'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export enum TemplateType {
  DOCX,
  EXCEL,
}
@Provide()
export class TemplateInstanceService {
  @InjectEntityModel(Template)
  templateModel: Repository<Template>

  @InjectEntityModel(TemplateInstance)
  templateInstanceModel: Repository<TemplateInstance>

  async newInstance({
    templateId,
    tags,
    staffId,
    type,
  }: NewTemplateInstanceDTO): Promise<boolean> {
    const template = await this.templateModel.findOne(templateId)
    if (!template) {
      return false
    }

    let instance = new TemplateInstance()
    instance = {
      ...instance,
      type,
      templateId,
      staffId,
      tags: JSON.stringify(tags),
    }
    await this.templateInstanceModel.create(instance)
    return true
  }

  async delInstance(instanceId: string): Promise<true> {
    await this.templateInstanceModel.delete(instanceId)
    return true
  }

  async updateInstance({
    id: instanceId,
    tags,
  }: UpdateTemplateInstanceDTO): Promise<true> {
    await this.templateInstanceModel.update(instanceId, {
      tags: JSON.stringify(tags),
    })
    return true
  }

  async queryInstance(instanceId: string): Promise<TemplateInstance> {
    const instance = await this.templateInstanceModel.findOne(instanceId)
    return instance
  }

  async getInstanceList(staffId: string): Promise<TemplateInstance[]> {
    const instances = await this.templateInstanceModel.find({
      where: {
        staffId,
      },
    })
    return instances
  }

  async copyInstance(instanceId: string): Promise<string> {
    const instance = await this.templateInstanceModel.findOne(instanceId)
    const newInstance = await this.templateInstanceModel.create({
      ...instance,
      id: null,
    })
    return newInstance.id
  }

  async downloadInstance(instanceId: string): Promise<[boolean, string]> {
    const instance = await this.templateInstanceModel.findOne(instanceId)
    if (!instance) return [false, null]
    const { templateId } = instance
    const template = await this.templateModel.findOne(templateId)
    if (!templateId) return [false, null]

    const doc = await loadDocxFile(readFileSync(template.path, 'binary'))
    doc.render(instance.tags)

    const content = doc.getZip().generate({
      type: 'nodebuffer',
    })

    const tmpPath = resolve('temp', template.filename)
    writeFileSync(tmpPath, content)

    return [true, tmpPath]
  }
}
