import { App, Configuration } from '@midwayjs/decorator'
import { ILifeCycle } from '@midwayjs/core'
import { Application } from 'egg'
import { join } from 'path'
import * as orm from '@midwayjs/orm'

const bodyParser = require('koa-bodyparser')

@Configuration({
  imports: [orm],
  importConfigs: [join(__dirname, './config')],
  conflictCheck: true,
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application

  async onReady() {
    this.app.use(bodyParser())
  }
}
