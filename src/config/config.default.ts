import {EggAppConfig, EggAppInfo, PowerPartial} from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export const orm = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'course_home',
  synchronize: false, // 如果第一次使用，不存在表，有同步的需求可以写 true
  logging: false,
};

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1635940289211_8649';

  // add your config here
  config.middleware = [];

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  };

  // config.security = {
  //   csrf: false,
  // };

  config.multipart = {
    mode: 'stream', fileSize: 1048576000, whitelist: ['.docx']
  }

  config.cors = {
    // {string|Function} origin: '*',
    origin: '*',
    // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  return config;
};
