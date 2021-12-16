import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Template } from '../entity/template'
import { Repository } from 'typeorm'
import { TemplateInstance } from '../entity/template-instance'
import {
  NewTemplateInstanceDTO,
  QueryTemplateInstanceDTO,
  UpdateTemplateInstanceDTO,
} from '../dto/templateInstance/template-instance'
import { loadDocxFile } from '../utils/doc'
import { readFileSync, unlinkSync, writeFileSync } from 'fs'
import path, { resolve } from 'path'
import { FileStream } from '../../typings/app'
import xlsx from 'xlsx'
import { Course } from '../entity/course'
import { generaFileId, writeFileToDisk } from '../utils/common'

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

  @InjectEntityModel(Course)
  courseModel: Repository<Course>

  async newInstance({
    templateId,
    tags,
    staffId,
    // courseId,
    type,
  }: NewTemplateInstanceDTO): Promise<[boolean, any]> {
    try {
      const template = await this.templateModel.findOne(templateId)
      if (!template) {
        return [false, new Error('template not found')]
      }

      // const course = await this.templateModel.findOne(courseId)
      // if (!course) {
      //   return [false, new Error('course not found')]
      // }

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
    courseId,
  }: UpdateTemplateInstanceDTO): Promise<[boolean, any]> {
    try {
      if (courseId) {
        const course = await this.templateModel.findOne(courseId)
        if (!course) {
          return [false, new Error('course not found')]
        }

        await this.templateInstanceModel.update(instanceId, {
          tags: JSON.stringify(tags),
          courseId,
        })
      }

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

  async getInstanceList(
    staffId: string,
    { templateId, courseId }: { templateId?: string; courseId?: string } = {}
  ): Promise<QueryTemplateInstanceDTO[]> {
    let instances
    if (templateId && courseId) {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          templateId,
          courseId,
          type: TemplateType.DOCX,
        },
        select: ['id', 'templateId', 'type', 'courseId', 'updateAt'],
      })
    } else if (courseId) {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          courseId,
          type: TemplateType.DOCX,
        },
        select: ['id', 'templateId', 'type', 'courseId', 'updateAt'],
      })
    } else if (templateId) {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          templateId,
          type: TemplateType.DOCX,
        },
        select: ['id', 'templateId', 'type', 'courseId', 'updateAt'],
      })
    } else {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          type: TemplateType.DOCX,
        },
        select: ['id', 'templateId', 'type', 'courseId', 'updateAt'],
      })
    }

    if (instances && instances.length > 0) {
      for (let i = 0; i < instances.length; i++) {
        const instance = instances[i]
        const { filename } = await this.templateModel.findOne(
          instance.templateId
        )
        const { courseName } = await this.courseModel.findOne(instance.courseId)
        instances[i] = {
          ...instance,
          templateName: filename,
          courseName,
        }
      }
    }
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

    console.log(instance.tags)
    const doc = await loadDocxFile(readFileSync(template.path, 'binary'))
    doc.render(JSON.parse(instance.tags))

    const content = doc.getZip().generate({
      type: 'nodebuffer',
    })

    const tmpPath = resolve('temp', template.filename)
    writeFileSync(tmpPath, content)

    return [true, tmpPath]
  }

  async listEXCELInstance(
    staffId: string,
    { templateId, courseId }: { templateId?: string; courseId?: string } = {}
  ): Promise<QueryTemplateInstanceDTO[]> {
    let instances
    if (templateId && courseId) {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          templateId,
          courseId,
          type: TemplateType.EXCEL,
        },
        select: ['id', 'templateId', 'type', 'courseId', 'updateAt'],
      })
    } else if (courseId) {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          courseId,
          type: TemplateType.EXCEL,
        },
        select: ['id', 'templateId', 'type', 'courseId', 'updateAt'],
      })
    } else if (templateId) {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          templateId,
          type: TemplateType.EXCEL,
        },
        select: ['id', 'templateId', 'type', 'courseId', 'updateAt'],
      })
    } else {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          type: TemplateType.EXCEL,
        },
        select: ['id', 'templateId', 'type', 'courseId', 'updateAt'],
      })
    }

    if (instances && instances.length > 0) {
      for (let i = 0; i < instances.length; i++) {
        const instance = instances[i]
        const { filename } = await this.templateModel.findOne(
          instance.templateId
        )
        const { courseName } = await this.courseModel.findOne(instance.courseId)
        instances[i] = {
          ...instance,
          templateName: filename,
          courseName,
        }
      }
    }
    return instances
  }

  async uploadExcelAndSaveToInstance(
    fid: string,
    staffId: string,
    file: FileStream
  ): Promise<[boolean, any]> {
    console.log(fid)
    const template = await this.templateModel.findOne({
      where: {
        fid,
        type: TemplateType.EXCEL,
      },
    })

    if (!template) return [false, null]

    // const doc = loadDocxFile(readFileSync(template.path, 'binary'))
    const tmpFilename = `xlsx${generaFileId()}`
    await writeFileToDisk(tmpFilename, file)

    const fileDir = path.join('template', tmpFilename)
    const workbook = xlsx.readFile(fileDir)
    unlinkSync(fileDir)
    const data = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]]
    )

    console.log(data)

    return await this.newInstance({
      type: TemplateType.EXCEL,
      tags: { clints: data },
      templateId: fid,
      staffId,
    })

    // doc.render(data)
    // const content = doc.getZip().generate({
    //   type: 'nodebuffer',
    // })
    //
    // const tmpPath = resolve('temp', template.filename)
    //
    // writeFileSync(tmpPath, content)

    // return [true, tmpPath]
  }
}
