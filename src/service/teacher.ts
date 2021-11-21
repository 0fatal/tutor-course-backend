import { InjectEntityModel } from '@midwayjs/orm';
import { Teacher } from '../entity/teacher';
import { Repository } from 'typeorm';
import MD5 from 'crypto-js/md5';
import { randomUUID } from 'crypto';

export class TeacherService {
  @InjectEntityModel(Teacher)
  _teacherModel: Repository<Teacher>;

  async getByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<Teacher> {
    password = MD5(password);
    return await this._teacherModel.findOne({
      where: {
        username,
        password,
      },
    });
  }

  async findByTid(tid: string): Promise<Teacher> {
    return await this._teacherModel.findOne(tid);
  }

  async registry(info: Teacher) {
    // eslint-disable-next-line prefer-const
    let { username, password } = info;
    const tid = randomUUID();

    password = MD5(password);

    await this._teacherModel.create({
      tid,
      username,
      password,
    });
  }
}
