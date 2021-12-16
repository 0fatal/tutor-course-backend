import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { readFileSync, unlink, writeFileSync } from 'fs'
import { resolve } from 'path'
import { Repository } from 'typeorm'
import { promisify } from 'util'
import { FileStream } from '../../typings/app'
import { generaFileId, writeFileToDisk } from '../utils/common'
import { Template } from './../entity/template'
import { getDocxTags, loadDocxFile } from './../utils/doc'
import { TemplateType } from './template-instance'
import { Teacher } from '../entity/teacher'
import { Course } from '../entity/course'
import dayjs from 'dayjs'

@Provide()
export class TemplateService {
  @InjectEntityModel(Template)
  templateModel: Repository<Template>

  async uploadTemplate(
    file: FileStream,
    templateType: number
  ): Promise<[ifSuccess: boolean, res: any]> {
    const fid = generaFileId()
    const fileName = `${fid}.docx`

    const {
      type: writeResType,
      error,
      fileDir,
    } = await writeFileToDisk(fileName, file)
    if (writeResType) {
      let template = new Template()
      template = {
        ...template,
        fid,
        filename: file.filename,
        path: fileDir,
        createAt: new Date(),
        type: templateType,
      }

      try {
        await this.templateModel.save(template)
        return [
          true,
          {
            fid,
          },
        ]
      } catch (e) {
        return [false, e]
      }
    } else {
      return [false, error]
    }
  }

  async renderAndBuild(fid: string, tags: any): Promise<[string, any]> {
    const template = await this.templateModel.findOne(fid)
    // var out = doc.getZip().generate({
    //   type: 'blob',
    //   mimeType:
    //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    // }) // Output the document using Data-URI
    const doc = await loadDocxFile(readFileSync(template.path, 'binary'))
    doc.render(tags)
    const content = doc.getZip().generate({
      type: 'nodebuffer',
    })

    const tmpPath = resolve('temp', template.filename)
    writeFileSync(tmpPath, content)
    return [template.filename, tmpPath]
    // const { type:writeResType, error,fileDir } = await writeFileToDisk(fileName,file)

    // if (writeResType) {
    //   let template = new Template()
    //   template = {
    //     ...template,
    //     fid,
    //     filename: fileName,
    //     path: fileDir,
    //     createAt: new Date()
    //   }

    //   try {
    //     const tags = await getDocxTags(loadDocxFile(readFileSync(fileDir,'binary')))
    //     await this.templateModel.save(template)
    //     return [true,{
    //       fid,
    //       tags
    //     }]
    //   } catch(e) {
    //     return  [false,e]
    //   }
    // }
    // else {
    //   return  [false,error]
    // }
  }

  async getTemplateList(courseId?: string): Promise<TemplateList> {
    console.log(courseId)
    return (
      await this.templateModel.find({
        order: {
          createAt: 'DESC',
        },
        where: Object.assign(
          { type: TemplateType.DOCX },
          courseId
            ? {
                courseId,
              }
            : {}
        ),
      })
    ).map(({ fid, filename, createAt }) => ({
      fid,
      filename,
      createAt,
    })) as TemplateList
  }

  async getEXCELTemplateList(courseId?: string): Promise<TemplateList> {
    console.log(courseId)
    return (
      await this.templateModel.find({
        order: {
          createAt: 'DESC',
        },
        where: Object.assign(
          { type: TemplateType.EXCEL },
          courseId
            ? {
                courseId,
              }
            : {}
        ),
      })
    ).map(({ fid, filename, createAt }) => ({
      fid,
      filename,
      createAt,
    })) as TemplateList
  }

  async getTemplate(fid: string): Promise<[string, any]> {
    const template = await this.templateModel.findOne(fid)
    return [template.filename, template.path]
  }

  async getTags(fid: string, tid: string): Promise<any> {
    const template = await this.templateModel.findOne(fid)
    return await this.processTags(template.path, tid, template.courseId)
  }

  async processTags(
    templatePath: string,
    tid: string,
    cid: string
  ): Promise<any> {
    let tags = await getDocxTags(
      loadDocxFile(readFileSync(templatePath, 'binary'))
    )

    // TODO 常量变换，不依赖于身份
    // TODO 变量变换，依赖于角色
    // teacherName courseName courseCode nature
    // TODO 计算属性
    // TODO 预设变量
    // beginSchoolYear endSchoolYear editTime填表时间

    for (const key of Object.keys(tags)) {
      const v = tags[key]
      if (Object.keys(v).length === 0) {
        tags[key] = ''
      } else {
        const arr = []
        for (const key2 of Object.keys(v)) {
          v[key2] = ''
        }
        arr.push(v)
        tags[key] = arr
      }
    }
    tags = await this._innerBaseTagsReplace(tags)
    tags = await this._infoBaseTagsReplace(tags, tid, cid)
    console.log(tags)
    return tags
  }

  async _innerBaseTagsReplace(tags: any): Promise<any> {
    const replaceMap = {
      beginSchoolYear() {
        const date = new Date()
        if (date.getMonth() >= 9) {
          return date.getFullYear()
        }
        return date.getFullYear() - 1
      },

      endSchoolYear() {
        const date = new Date()
        if (date.getMonth() >= 9) {
          return date.getFullYear() + 1
        }
        return date.getFullYear()
      },

      semester() {
        const date = new Date()
        if (date.getMonth() >= 9) {
          return 1
        }
        return 0
      },

      editTime() {
        return dayjs().format('YYYY-MM-DD')
      },
    }

    const keys = Object.keys(tags)
    for (const [k, v] of Object.entries(replaceMap)) {
      if (keys.includes(k)) {
        tags[k] = v()
      }
    }
    return tags
  }

  @InjectEntityModel(Teacher)
  private teacherRepository: Repository<Teacher>
  @InjectEntityModel(Course)
  private courseRepository: Repository<Course>

  // 基于身份信息的变量替换
  async _infoBaseTagsReplace(
    tags: any,
    tid: string,
    cid: string
  ): Promise<any> {
    const teacher = await this.teacherRepository.findOne(tid)
    const course = await this.courseRepository.findOne(cid)

    const replaceMap = {
      teacherName() {
        return teacher.name
      },

      courseName() {
        return course.courseName
      },

      courseCode() {
        let beginSchoolYear: number
        let endSchoolYear: number
        let semester: number
        const date = new Date()
        if (date.getMonth() >= 9) {
          beginSchoolYear = date.getFullYear()
          semester = 1
        } else {
          beginSchoolYear = date.getFullYear() - 1
          semester = 2
        }

        endSchoolYear = beginSchoolYear + 1

        return `(${beginSchoolYear}-${endSchoolYear}-${semester})-${course.courseNum}-`
      },
    }
    const keys = Object.keys(tags)
    for (const [k, v] of Object.entries(replaceMap)) {
      if (keys.includes(k)) {
        tags[k] = v()
      }
    }
    return tags
  }

  async deleteTemplate(fid: string): Promise<boolean> {
    const template = await this.templateModel.findOne(fid)
    if (template) {
      const ifSuccess = (await this.templateModel.delete(fid)).affected > 0
      if (ifSuccess) {
        try {
          await promisify(unlink)(template.path)
        } catch (e) {
          console.log(`rm ${template.filename} error: ${e.message}`)
        }
      }
      return ifSuccess
    }
    return false
  }

  async downloadTemplate(iid: string) {}
}

export type TemplateList = {
  fid: string
  filename: string
  createAt: Date
}[]
