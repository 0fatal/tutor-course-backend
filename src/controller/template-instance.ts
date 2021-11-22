import { Controller, Inject, Provide } from '@midwayjs/decorator';
import { R } from '../utils/response';
import { InjectEntityModel } from '@midwayjs/orm';
import { TemplateInstanceService } from '../service/template-instance';

@Provide()
@Controller('/instance')
export class TemplateInstanceController {
  @Inject()
  templateInstanceService: TemplateInstanceService;
  async newInstance(): Promise<R> {
    this.templateInstanceService.newInstance();
  }
}
