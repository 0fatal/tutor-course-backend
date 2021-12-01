import { InjectEntityModel } from '@midwayjs/orm'
import { Teacher } from '../entity/teacher'
import { Repository } from 'typeorm'
import MD5 from 'crypto-js/md5'
import { RegistryTeacherDTO, UpdateTeacherDTO } from '../dto/teacher/teacher'
import { Provide } from '@midwayjs/decorator'
import { TeacherInfoDTO } from '../dto/teacher/teacher.response'

@Provide()
export class TeacherService {
  @InjectEntityModel(Teacher)
  _teacherModel: Repository<Teacher>

  async getByStaffIdAndPassword(
    staffId: string,
    password: string
  ): Promise<Teacher> {
    password = MD5(password).toString()
    return await this._teacherModel.findOne({
      where: {
        staffId,
        password,
      },
    })
  }

  async findByStaffId(staffId: string): Promise<TeacherInfoDTO> {
    const teacher: TeacherInfoDTO = (await this._teacherModel.findOne(staffId, {
      select: ['staffId', 'name', 'isAdmin', 'createAt', 'updateAt'],
    })) as TeacherInfoDTO
    return teacher
  }

  async registry(info: RegistryTeacherDTO): Promise<[boolean, any]> {
    try {
      // eslint-disable-next-line prefer-const
      let { staffId, password, name } = info
      password = MD5(password).toString()
      const teacher = this._teacherModel.create({
        staffId,
        password,
        name,
      })

      await this._teacherModel.insert(teacher)
      return [true, null]
    } catch (e: any) {
      console.log(e)
      const message: string =
        e.code === 'ER_DUP_ENTRY' ? 'teacher exists' : null
      return [false, message]
    }
  }

  async updateInfo(staffId: string, data: UpdateTeacherDTO): Promise<boolean> {
    try {
      const res = await this._teacherModel.update(staffId, data)
      return res.affected === 1
    } catch (e: any) {
      console.log(e)
      return false
    }
  }
}
