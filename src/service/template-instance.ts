import { Inject, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Template } from '../entity/template'
import { Repository } from 'typeorm'
import { TemplateInstance } from '../entity/template-instance'
import {
  CopyTemplateInstance,
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
import { mergeDocumentDocx } from '../utils/cloudmersive'
import { TemplateService } from './template'

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
    courseId,
    name,
    excelId,
  }: NewTemplateInstanceDTO): Promise<[boolean, any]> {
    try {
      const template = await this.templateModel.findOne(templateId)
      if (!template) {
        return [false, new Error('template not found')]
      }

      const course = await this.courseModel.findOne(courseId)
      if (!course) {
        return [false, new Error('course not found')]
      }

      let instance = new TemplateInstance()
      instance = {
        ...instance,
        templateId,
        staffId,
        name,
        courseId,
        excelId,
        tags: JSON.stringify(tags),
      }

      if (courseId === null) {
        instance = {
          ...instance,
          excelS: generaFileId(),
          type: TemplateType.EXCEL,
        }
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
    name,
    excelId,
  }: UpdateTemplateInstanceDTO): Promise<[boolean, any]> {
    try {
      await this.templateInstanceModel.update(instanceId, {
        tags: JSON.stringify(tags),
        name,
        excelId,
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
        select: ['id', 'name', 'templateId', 'courseId', 'updateAt'],
      })
    } else if (courseId) {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          courseId,
          type: TemplateType.DOCX,
        },
        select: ['id', 'name', 'templateId', 'courseId', 'updateAt', 'excelId'],
      })
    } else if (templateId) {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          templateId,
          type: TemplateType.DOCX,
        },
        select: ['id', 'name', 'templateId', 'courseId', 'updateAt', 'excelId'],
      })
    } else {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          type: TemplateType.DOCX,
        },
        select: ['id', 'name', 'templateId', 'courseId', 'updateAt', 'excelId'],
      })
    }

    if (instances && instances.length > 0) {
      for (let i = 0; i < instances.length; i++) {
        const instance = instances[i]
        const { templateName } = await this.templateModel.findOne(
          instance.templateId
        )
        const { courseName, courseId } = await this.courseModel.findOne(
          instance.courseId
        )

        console.log(instance.excelId)
        let excel = null

        if (instance.excelId) {
          const { id, name } = await this.templateInstanceModel.findOne(
            instance.excelId
          )
          excel = {
            id,
            name,
          }
        }

        instances[i] = {
          id: instance.id,
          name: instance.name,
          updateAt: instance.updateAt,
          template: {
            templateId: instance.templateId,
            templateName: templateName,
          },
          excel: excel,
          course: {
            courseName,
            courseId,
          },
        } as QueryTemplateInstanceDTO
      }
    }
    return instances
  }

  @Inject()
  private templateService: TemplateService

  async copyInstance({
    instanceId,
    courseId,
    name,
  }: CopyTemplateInstance): Promise<[boolean, any]> {
    const instance = await this.templateInstanceModel.findOne(instanceId)
    if (!instance) return [false, new Error('instance not found')]

    let tags = await this.templateService._innerBaseTagsReplace(
      JSON.parse(instance.tags)
    )
    tags = await this.templateService._infoBaseTagsReplace(
      tags,
      tags.templateId,
      courseId
    )
    const newInstance = this.templateInstanceModel.create({
      ...instance,
      tags: JSON.stringify(tags),
      courseId: courseId,
      name,
    })

    delete newInstance['id']
    delete newInstance['excelId']
    delete newInstance['createAt']
    delete newInstance['updateAt']

    try {
      await this.templateInstanceModel.insert(newInstance)
    } catch (e: any) {
      return [false, new Error('该课程已经绑定文档实例，请先删除')]
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
    const doc = await loadDocxFile(readFileSync(template.filepath, 'binary'))
    doc.render(JSON.parse(instance.tags))

    const content = doc.getZip().generate({
      type: 'nodebuffer',
    })

    const tmpPath = resolve('temp', generaFileId() + template.templateName)
    writeFileSync(tmpPath, content)

    if (instance.excelId) {
      const excel = await this.templateInstanceModel.findOne(instance.excelId)
      const { templateId: excelTemplateId } = excel
      const excelTemplate = await this.templateModel.findOne(excelTemplateId)
      const excelDoc = await loadDocxFile(
        readFileSync(excelTemplate.filepath, 'binary')
      )
      excelDoc.render(JSON.parse(excel.tags))
      const excelContent = excelDoc.getZip().generate({
        type: 'nodebuffer',
      })

      console.log(excel.tags)

      const excelTmpPath = resolve('temp', generaFileId())
      writeFileSync(excelTmpPath, excelContent)

      const data = await mergeDocumentDocx(tmpPath, excelTmpPath)
      writeFileSync(tmpPath, data)
      unlinkSync(excelTmpPath)
    }

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
        select: ['id', 'name', 'templateId', 'courseId', 'updateAt'],
      })
    } else if (courseId) {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          courseId,
          type: TemplateType.EXCEL,
        },
        select: ['id', 'name', 'templateId', 'courseId', 'updateAt'],
      })
    } else if (templateId) {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          templateId,
          type: TemplateType.EXCEL,
        },
        select: ['id', 'name', 'templateId', 'courseId', 'updateAt'],
      })
    } else {
      instances = await this.templateInstanceModel.find({
        where: {
          staffId,
          type: TemplateType.EXCEL,
        },
        select: ['id', 'name', 'templateId', 'courseId', 'updateAt'],
      })
    }

    if (instances && instances.length > 0) {
      for (let i = 0; i < instances.length; i++) {
        const instance = instances[i]
        const { templateName } = await this.templateModel.findOne(
          instance.templateId
        )
        const { courseName, courseId } = await this.courseModel.findOne(
          instance.courseId
        )

        instances[i] = {
          id: instance.id,
          name: instance.name,
          updateAt: instance.updateAt,
          template: {
            templateId: instance.templateId,
            templateName: templateName,
          },
          course: {
            courseName,
            courseId,
          },
        } as QueryTemplateInstanceDTO
      }
    }
    return instances
  }

  async uploadExcelAndSaveToInstance(
    tid: string,
    staffId: string,
    file: FileStream
  ): Promise<[boolean, any]> {
    const template = await this.templateModel.findOne(tid)

    if (!template) return [false, null]

    const tmpFilename = `xlsx${generaFileId()}`
    await writeFileToDisk(tmpFilename, file, 'temp')

    const fileDir = path.join('temp', tmpFilename)
    const workbook = xlsx.readFile(fileDir)
    unlinkSync(fileDir)
    const data = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]]
    )

    console.log(data)

    return await this.newInstance({
      tags: { clints: data },
      templateId: tid,
      name: file.filename,
      staffId,
      courseId: null,
      excelId: null,
    })
  }
}
