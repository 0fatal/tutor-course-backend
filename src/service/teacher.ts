import { InjectEntityModel } from '@midwayjs/orm';
import { Teacher } from '../entity/teacher';
import { Repository } from 'typeorm';
import MD5 from 'crypto-js/md5';
import { RegistryTeacherDTO } from '../dto/teacher/teacher';

export class TeacherService {
  @InjectEntityModel(Teacher)
  _teacherModel: Repository<Teacher>;

  async getByStaffIdAndPassword(
    staffId: string,
    password: string
  ): Promise<Teacher> {
    password = MD5(password).toString();
    return await this._teacherModel.findOne({
      where: {
        staffId,
        password,
      },
    });
  }

  async findByStaffId(staffId: string): Promise<Teacher> {
    return await this._teacherModel.findOne(staffId);
  }

  async registry(info: RegistryTeacherDTO): Promise<boolean> {
    // eslint-disable-next-line prefer-const
    let { staffId, password, name } = info;
    password = MD5(password).toString();

    if (
      !(await this._teacherModel.create({
        staffId,
        password,
        name,
      }))
    ) {
      return false;
    }
    return true;
  }
}
