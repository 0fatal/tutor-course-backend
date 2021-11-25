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
} from '@midwayjs/decorator'
import { R } from '../utils/response'
import { TemplateInstanceService } from '../service/template-instance'
import {
  NewTemplateInstanceDTO,
  UpdateTemplateInstanceDTO,
} from '../dto/templateInstance/template-instance'
import { Context } from 'egg'
import { Teacher } from '../entity/teacher'

@Provide()
@Controller('/instance')
export class TemplateInstanceController {
  @Inject()
  templateInstanceService: TemplateInstanceService

  @Inject()
  ctx: Context

  @Post('/new')
  async newInstance(@Body(ALL) data: NewTemplateInstanceDTO): Promise<R> {
    const ok = this.templateInstanceService.newInstance(data)
    if (!ok) return R.Fail().Msg('create new instance fail')
    return R.Ok()
  }

  @Patch('/')
  async updateInstance(@Body(ALL) data: UpdateTemplateInstanceDTO): Promise<R> {
    const ok = this.templateInstanceService.updateInstance(data)
    if (!ok) return R.Fail().Msg('update fail')
    return R.Ok()
  }

  @Get('/')
  async listInstances(): Promise<R> {
    const data = this.templateInstanceService.getInstanceList(
      (this.ctx.teacher as Teacher).staffId
    )
    if (!data) return R.Fail().Msg('get list fail')
    return R.Ok().Data(data)
  }

  @Post('/copy/:id')
  async copyInstance(@Param('id') iid: string): Promise<R> {
    const nid = this.templateInstanceService.copyInstance(iid)
    return R.Ok().Data({
      newInstanceId: nid,
    })
  }

  @Del('/:id')
  async delInstance(@Param('id') iid: string): Promise<R> {
    const ok = this.templateInstanceService.delInstance(iid)
    if (!ok) return R.Fail().Msg('del fail')
    return R.Ok()
  }
}
