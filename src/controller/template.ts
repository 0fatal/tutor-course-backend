import {
  Controller,
  Del,
  Get,
  Inject,
  Param,
  Post,
  Provide,
  Query,
} from '@midwayjs/decorator'
import { Context } from '@midwayjs/web'
import { createReadStream, statSync } from 'fs'
import { R } from '../utils/response'
import { TemplateService } from '../service/template'
import { Teacher } from '../entity/teacher'
import { TemplateType } from '../service/template-instance'

@Provide()
@Controller('/template')
export class TemplateController {
  @Inject()
  _templateService: TemplateService

  @Inject()
  ctx: Context

  @Post('/upload')
  async parse(ctx: Context, @Query('type') templateType: string): Promise<R> {
    const file = await ctx.getFileStream()

    const [ifSuccess, res] = await this._templateService.uploadTemplate(
      file,
      templateType === '1' ? TemplateType.EXCEL : TemplateType.DOCX
    )

    return ifSuccess ? R.Ok().Data(res) : R.Fail().Msg(res.message)
  }

  @Get('/')
  async list(): Promise<R> {
    return R.Ok().Data(await this._templateService.getTemplateList())
  }

  @Get('/excel')
  async listExcel(): Promise<R> {
    return R.Ok().Data(await this._templateService.getEXCELTemplateList())
  }

  @Get('/:tid')
  async getTemplate(ctx: Context, @Param('tid') tid: string) {
    const [templateName, filepath] = await this._templateService.getTemplate(
      tid
    )
    // ctx.attachment([filename], [options]) 将 Content-Disposition 设置为 “附件” 以指示客户端提示下载。
    ctx.attachment(templateName, {
      fallback: true,
      type: 'attachment', // [string] attachment/inline
    })
    const stats = statSync(filepath)
    ctx.response.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${encodeURIComponent(
        templateName
      )};filename*=utf-8''${encodeURIComponent(templateName)}"`,
      'Content-Length': stats.size.toString(),
    })
    ctx.body = createReadStream(filepath)
  }

  @Del('/:tid')
  async deleteTemplate(@Param('tid') tid: string): Promise<R> {
    const ifSuccess = await this._templateService.deleteTemplate(tid)
    return ifSuccess ? R.Ok() : R.Fail()
  }

  @Get('/tags')
  async getTags(
    @Query('templateId') tid: string,
    @Query('courseId') cid: string
  ): Promise<R> {
    return R.Ok().Data(
      await this._templateService.getTags({
        tid,
        staffId: (this.ctx.teacher as Teacher).staffId,
        courseId: cid,
      })
    )
  }
}
