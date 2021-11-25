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
import xlsx from 'xlsx'

@Provide()
export class TemplateService {
  @InjectEntityModel(Template)
  templateModel: Repository<Template>

  async uploadTemplate(
    file: FileStream
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

  async getTemplateList(): Promise<TemplateList> {
    return (
      await this.templateModel.find({
        order: {
          createAt: 'DESC',
        },
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

  async getTags(fid: string): Promise<any> {
    const template = await this.templateModel.findOne(fid)
    return await this.processTags(template.path)
  }

  async processTags(templatePath: string) {
    let tags = await getDocxTags(
      loadDocxFile(readFileSync(templatePath, 'binary'))
    )
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
    tags = this._innerTagReplace(tags)
    console.log(tags)
    return tags
  }

  _innerTagReplace(tags): any {
    const replaceMap = {
      beginSchoolYear: () => {
        const date = new Date()
        if (date.getMonth() >= 9) {
          return date.getFullYear()
        }
        return date.getFullYear() - 1
      },
      endSchoolYear: () => {
        const date = new Date()
        if (date.getMonth() >= 9) {
          return date.getFullYear() + 1
        }
        return date.getFullYear()
      },
      totalHours: tags => {
        let totalHours = 0
        for (const key of Object.keys(tags)) {
          if (key !== 'totalHours' && key.match(/.*?Hours$/)) {
            const hours = Number(tags[key])
            if (!isNaN(hours) && hours > 0) {
              totalHours += hours
            }
          }
        }
        return totalHours
      },
      totalScore: tags => {
        let totalScore = 0
        for (const key of Object.keys(tags)) {
          if (key !== 'totalScore' && key.match(/.*?Score$/)) {
            const score = Number(tags[key])
            if (!isNaN(score) && score > 0) {
              totalScore += score
            }
          }
        }
        return totalScore
      },
      number: tag => {
        for (const [v, idx] of tag) {
          if (v.hasOwnProperty('number')) {
            v['number'] = idx + 1
          }
        }
      },
    }

    for (const key of Object.keys(tags)) {
      let v = tags[key]
      // if(typeof v === 'object') {
      //   replaceMap['number'](v)
      // }
      if (replaceMap.hasOwnProperty(key)) {
        v = replaceMap[key](tags)
      }
      tags[key] = v
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

  async parseExcel(
    fid: string,
    file: FileStream
  ): Promise<[ifSuccess: boolean, res: any]> {
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

export type TemplateList = {
  fid: string
  filename: string
  createAt: Date
}[]
