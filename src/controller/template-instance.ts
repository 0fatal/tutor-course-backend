import {
  ALL,
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Provide,
  Query,
  Validate,
} from '@midwayjs/decorator'
import { R } from '../utils/response'
import { TemplateInstanceService } from '../service/template-instance'
import {
  NewTemplateInstanceDTO,
  UpdateTemplateInstanceDTO,
} from '../dto/templateInstance/template-instance'
import { Context } from 'egg'
import { Teacher } from '../entity/teacher'
import { createReadStream, statSync } from 'fs'

@Provide()
@Controller('/instance')
export class TemplateInstanceController {
  @Inject()
  templateInstanceService: TemplateInstanceService

  @Inject()
  ctx: Context

  @Post('/new')
  async newInstance(
    @Body(ALL) data: NewTemplateInstanceDTO,
    @Query('template_id') templateId: string
  ): Promise<R> {
    data.staffId = (this.ctx.teacher as Teacher).staffId
    if (!data.staffId) return R.Fail().Msg('please relogin again')
    if (templateId) {
      const file = await this.ctx.getFileStream()
      const [ok, err] =
        await this.templateInstanceService.uploadExcelAndSaveToInstance(
          templateId,
          data.staffId,
          file
        )
      if (!ok)
        return R.Fail().Msg(`create new instance fail: ${err || err.message}`)
      return R.Ok()
    }
    const [ok, err] = await this.templateInstanceService.newInstance(data)
    if (!ok)
      return R.Fail().Msg(`create new instance fail: ${err || err.message}`)
    return R.Ok()
  }

  @Patch('/')
  @Validate()
  async updateInstance(@Body(ALL) data: UpdateTemplateInstanceDTO): Promise<R> {
    if (typeof data.tags !== 'object') {
      return R.Fail().Msg('wrong tags')
    }
    const [ok, err] = await this.templateInstanceService.updateInstance(data)
    if (!ok) return R.Fail().Msg(err.message)
    return R.Ok()
  }

  @Get('/')
  async listInstances(
    @Query('course_id') courseId,
    @Query('template_id') templateId
  ): Promise<R> {
    const data = await this.templateInstanceService.getInstanceList(
      (this.ctx.teacher as Teacher).staffId,
      {
        courseId,
        templateId,
      }
    )

    if (!data) return R.Fail().Msg('get list fail')
    return R.Ok().Data(data)
  }

  @Get('/excel')
  async listExcelInstances(
    @Query('course_id') courseId,
    @Query('template_id') templateId
  ): Promise<R> {
    const data = await this.templateInstanceService.listEXCELInstance(
      (this.ctx.teacher as Teacher).staffId,
      {
        courseId,
        templateId,
      }
    )

    if (!data) return R.Fail().Msg('get list fail')
    return R.Ok().Data(data)
  }

  @Post('/copy/:id')
  async copyInstance(@Param('id') iid: string): Promise<R> {
    const [ok, res] = await this.templateInstanceService.copyInstance(iid)
    if (!ok) return R.Fail().Msg(res.message)
    return R.Ok().Data({
      newInstanceId: res,
    })
  }

  @Del('/:id')
  async delInstance(@Param('id') iid: string): Promise<R> {
    const ok = await this.templateInstanceService.delInstance(iid)
    if (!ok) return R.Fail().Msg('del fail')
    return R.Ok()
  }

  @Get('/:id')
  async infoInstance(@Param('id') iid: string): Promise<R> {
    const instance = await this.templateInstanceService.queryInstance(iid)
    if (!instance) return R.Fail().Msg('instance not found')
    return R.Ok().Data(instance)
  }

  @Get('/download/:id')
  async downloadInstance(@Param('id') iid: string) {
    const [ok, res] = await this.templateInstanceService.downloadInstance(iid)

    if (!ok) return R.Fail().Msg(res.message)

    this.ctx.attachment(iid, {
      fallback: true,
      type: 'attachment', // [string] attachment/inline
    })
    const stats = statSync(res)
    this.ctx.response.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${iid}`,
      'Content-Length': stats.size.toString(),
    })
    this.ctx.body = createReadStream(res)
  }
}
