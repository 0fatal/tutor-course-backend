export const orm = {
  type: 'mysql',
  host: '172.18.0.1',
  port: 3306,
  username: 'course_manager',
  password: 'J68WPMhCaK7BfeTr',
  database: 'course_home',
  synchronize: false, // 如果第一次使用，不存在表，有同步的需求可以写 true
  logging: false,
}