export const orm = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'course_home',
  synchronize: false, // 如果第一次使用，不存在表，有同步的需求可以写 true
  logging: false,
}