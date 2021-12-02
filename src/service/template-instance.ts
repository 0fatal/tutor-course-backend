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
import { FileStream } from '../../typings/app'
import xlsx from 'xlsx'

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
    courseId,
    type,
  }: NewTemplateInstanceDTO): Promise<[boolean, any]> {
    try {
      const template = await this.templateModel.findOne(templateId)
      if (!template) {
        return [false, new Error('template not found')]
      }

      const course = await this.templateModel.findOne(courseId)
      if (!course) {
        return [false, new Error('course not found')]
      }

      let instance = new TemplateInstance()
      instance = {
        ...instance,
        type,
        templateId,
        staffId,
        tags: JSON.stringify(tags),
      }

      await this.templateInstanceModel.insert(
        this.templateInstanceModel.create(instance)
      )
      return [true, null]
    } catch (e: any) {
      return [false, e]
    }
  }

  async delInstance(instanceId: string): Promise<boolean> {
    try {
      await this.templateInstanceModel.delete(instanceId)
    } catch (e: any) {
      console.log(e.message)
      return false
    }
    return true
  }

  async updateInstance({
    id: instanceId,
    tags,
  }: UpdateTemplateInstanceDTO): Promise<[boolean, any]> {
    try {
      await this.templateInstanceModel.update(instanceId, {
        tags: JSON.stringify(tags),
      })
    } catch (e: any) {
      return [false, e]
    }
    return [true, null]
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
      select: ['id', 'templateId', 'type'],
    })
    return instances
  }

  async copyInstance(instanceId: string): Promise<[boolean, any]> {
    const instance = await this.templateInstanceModel.findOne(instanceId)
    if (!instance) return [false, new Error('instance not found')]
    const newInstance = this.templateInstanceModel.create({
      ...instance,
    })

    delete newInstance['id']

    try {
      await this.templateInstanceModel.insert(newInstance)
    } catch (e: any) {
      return [false, e]
    }
    return [true, newInstance.id]
  }

  async downloadInstance(instanceId: string): Promise<[boolean, any]> {
    const instance = await this.templateInstanceModel.findOne(instanceId)
    if (!instance) return [false, new Error('instance not found')]
    const { templateId } = instance
    const template = await this.templateModel.findOne(templateId)
    if (!templateId) return [false, new Error('template not found')]

    const doc = await loadDocxFile(readFileSync(template.path, 'binary'))
    doc.render(instance.tags)

    const content = doc.getZip().generate({
      type: 'nodebuffer',
    })

    const tmpPath = resolve('temp', template.filename)
    writeFileSync(tmpPath, content)

    return [true, tmpPath]
  }

  async uploadExcelAndSaveToInstance(
    fid: string,
    file: FileStream
  ): Promise<[boolean, string]> {
    const template = await this.templateModel.findOne({
      where: {
        fid,
        type: TemplateType.EXCEL,
      },
    })

    if (!template) return [false, null]

    const doc = loadDocxFile(readFileSync(template.path, 'binary'))
    const workbook = xlsx.read(file)
    const data = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]]
    )

    doc.render(data)
    const content = doc.getZip().generate({
      type: 'nodebuffer',
    })

    const tmpPath = resolve('temp', template.filename)

    writeFileSync(tmpPath, content)

    return [true, tmpPath]
  }
}
