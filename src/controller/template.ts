import {
  ALL,
  Body,
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

@Provide()
@Controller('/template')
export class TemplateController {
  @Inject()
  _templateService: TemplateService

  @Inject()
  ctx: Context

  @Post('/parse')
  async parse(ctx: Context): Promise<R> {
    const file = await ctx.getFileStream()
    const [ifSuccess, res] = await this._templateService.uploadTemplate(file)

    return ifSuccess ? R.Ok().Data(res) : R.Fail().Msg(res.message)
  }

  @Post('/render')
  async render(ctx: Context, @Body(ALL) data: any) {
    // ctx.body = createReadStream()
    const [filename, filepath] = await this._templateService.renderAndBuild(
      data.fid,
      data.tags
    )
    // ctx.attachment([filename], [options]) 将 Content-Disposition 设置为 “附件” 以指示客户端提示下载。
    ctx.attachment(filename, {
      fallback: true,
      type: 'attachment', // [string] attachment/inline
    })
    const stats = statSync(filepath)
    ctx.response.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': stats.size.toString(),
    })
    ctx.body = createReadStream(filepath)
  }

  @Get('/')
  async list(@Query('course_id') courseId: string): Promise<R> {
    return R.Ok().Data(await this._templateService.getTemplateList(courseId))
  }

  @Get('/:fid')
  async getTemplate(ctx: Context, @Param('fid') fid: string) {
    const [filename, filepath] = await this._templateService.getTemplate(fid)
    // ctx.attachment([filename], [options]) 将 Content-Disposition 设置为 “附件” 以指示客户端提示下载。
    ctx.attachment(filename, {
      fallback: true,
      type: 'attachment', // [string] attachment/inline
    })
    const stats = statSync(filepath)
    ctx.response.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': stats.size.toString(),
    })
    ctx.body = createReadStream(filepath)
  }

  @Del('/:fid')
  async deleteTemplate(@Param('fid') fid: string): Promise<R> {
    const ifSuccess = await this._templateService.deleteTemplate(fid)
    return ifSuccess ? R.Ok() : R.Fail()
  }

  @Get('/tags')
  async getTags(@Query('fid') fid: string): Promise<R> {
    return R.Ok().Data(
      await this._templateService.getTags(
        fid,
        (this.ctx.teacher as Teacher).staffId
      )
    )
  }
}
