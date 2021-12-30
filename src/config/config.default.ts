import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
export { orm } from './orm.config'

export type DefaultConfig = PowerPartial<EggAppConfig>

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1635940289211_8649'

  // add your config here
  config.middleware = ['authMiddleware', 'errorMiddleware']

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  }

  config.security = {
    csrf: false,
  }

  config.multipart = {
    mode: 'stream',
    fileSize: 1048576000,
    whitelist: ['.docx', '.xlsx'],
  }

  config.cors = {
    // {string|Function} origin: '*',
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://template.zacharywin.top'
        : 'http://localhost:8081',
    // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }

  return config
}
