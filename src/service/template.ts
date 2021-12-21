import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { readFileSync, unlink } from 'fs'
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
    templateType: TemplateType
  ): Promise<[ifSuccess: boolean, res: any]> {
    const tid: string = generaFileId()
    const fileName = `${tid}.docx`

    const {
      type: writeResType,
      error,
      fileDir,
    } = await writeFileToDisk(fileName, file)
    if (writeResType) {
      let template = new Template()
      template = {
        ...template,
        tid,
        templateName: file.filename,
        filepath: fileDir,
        type: templateType,
      }

      try {
        await this.templateModel.save(template)
        return [
          true,
          {
            tid,
          },
        ]
      } catch (e) {
        return [false, e]
      }
    } else {
      return [false, error]
    }
  }

  async getTemplateList(): Promise<Template[]> {
    return await this.templateModel.find({
      order: {
        createAt: 'DESC',
      },
      where: { type: TemplateType.DOCX },
      select: ['templateName', 'tid', 'createAt'],
    })
  }

  async getEXCELTemplateList(): Promise<Template[]> {
    return await this.templateModel.find({
      order: {
        createAt: 'DESC',
      },
      where: { type: TemplateType.EXCEL },
      select: ['templateName', 'tid', 'createAt'],
    })
  }

  async getTemplate(fid: string): Promise<[string, any]> {
    const template = await this.templateModel.findOne(fid)
    return [template.templateName, template.filepath]
  }

  async getTags({
    tid,
    staffId,
    courseId,
  }: {
    tid: string
    staffId: string
    courseId: string
  }): Promise<any> {
    const template = await this.templateModel.findOne(tid)
    return await this.processTags(template.filepath, staffId, courseId)
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
      // beginSchoolYear() {
      //   const date = new Date()
      //   if (date.getMonth() >= 9) {
      //     return date.getFullYear()
      //   }
      //   return date.getFullYear() - 1
      // },
      //
      // endSchoolYear() {
      //   const date = new Date()
      //   if (date.getMonth() >= 9) {
      //     return date.getFullYear() + 1
      //   }
      //   return date.getFullYear()
      // },
      //
      // semester() {
      //   const date = new Date()
      //   if (date.getMonth() >= 9) {
      //     return 1
      //   }
      //   return 0
      // },

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
      beginSchoolYear() {
        return course?.beginYear
      },

      endSchoolYear() {
        return course?.endYear
      },

      semester() {
        return course?.semester
      },

      credit() {
        return course?.credit
      },

      nature() {
        return course?.courseNature.name
      },

      courseNature() {
        return this.nature()
      },

      teacherName() {
        return teacher.name
      },

      courseName() {
        return course?.courseName
      },

      courseCode() {
        if (!course) {
          return null
        }
        const { beginYear, endYear, semester } = course
        return `(${beginYear}-${endYear}-${semester})-${course.courseNum}-`
      },
    }
    const keys = Object.keys(tags)
    for (const [k, v] of Object.entries(replaceMap)) {
      if (keys.includes(k)) {
        tags[k] = v() || tags[k]
      }
    }
    return tags
  }

  async deleteTemplate(tid: string): Promise<boolean> {
    const template = await this.templateModel.findOne(tid)
    if (template) {
      const ifSuccess = (await this.templateModel.delete(tid)).affected > 0
      if (ifSuccess) {
        try {
          await promisify(unlink)(template.filepath)
        } catch (e) {
          console.log(`rm ${template.templateName} error: ${e.message}`)
        }
      }
      return ifSuccess
    }
    return false
  }
}
