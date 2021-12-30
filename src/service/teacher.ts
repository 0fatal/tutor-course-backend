import { InjectEntityModel } from '@midwayjs/orm'
import { Teacher } from '../entity/teacher'
import { Repository } from 'typeorm'
import MD5 from 'crypto-js/md5'
import {
  AdminUpdateTeacherDTO,
  RegistryTeacherDTO,
  UpdatePasswordDTO,
  UpdateTeacherDTO,
} from '../dto/teacher/teacher'
import { Provide } from '@midwayjs/decorator'
import { TeacherInfoDTO } from '../dto/teacher/teacher.response'
import { TeacherErrorMap } from '../errorType/teacher'
import { ErrorMap, ErrorType } from '../errorType/base'

@Provide()
export class TeacherService {
  @InjectEntityModel(Teacher)
  _teacherModel: Repository<Teacher>

  async getByStaffIdAndPassword(
    staffId: string,
    password: string
  ): Promise<Teacher> {
    password = MD5(password).toString()
    const teacher = await this._teacherModel.findOne({
      where: {
        staffId,
        password,
      },
    })
    if (!teacher) return null
    if (teacher.isAdmin === 1) return teacher
    if (teacher.forbidden) throw ErrorType.wrap(TeacherErrorMap.LOGIN_FORBIDDEN)
    return teacher
  }

  async getTeacherList(): Promise<Teacher[]> {
    return await this._teacherModel.find({
      select: [
        'staffId',
        'name',
        'createAt',
        'updateAt',
        'isAdmin',
        'forbidden',
      ],
    })
  }

  async findByStaffId(staffId: string): Promise<TeacherInfoDTO> {
    const teacher: TeacherInfoDTO = (await this._teacherModel.findOne(staffId, {
      select: ['staffId', 'name', 'isAdmin', 'createAt', 'updateAt'],
    })) as TeacherInfoDTO
    return teacher
  }

  async findByStaffIdPlus(staffId: string): Promise<Teacher> {
    const teacher = await this._teacherModel.findOne(staffId)
    if (!teacher) throw ErrorType.wrap(TeacherErrorMap.NOT_FOUND)
    return teacher
  }

  async delete(staffId: string): Promise<boolean> {
    const teacher = await this._teacherModel.findOne(staffId)
    if (!teacher) throw ErrorType.wrap(TeacherErrorMap.NOT_FOUND)
    if (teacher.isAdmin === 1)
      throw ErrorType.wrap(ErrorMap.REQUEST_FORBIDDEN, '不能删除管理员账号')
    return (await this._teacherModel.delete(staffId)).affected > 0
  }

  async changeForbiddenStatus(
    staffId: string,
    isForbidden: boolean
  ): Promise<boolean> {
    const teacher = await this._teacherModel.findOne(staffId)
    if (!teacher) throw ErrorType.wrap(TeacherErrorMap.NOT_FOUND)
    if (teacher.isAdmin === 1)
      throw ErrorType.wrap(ErrorMap.REQUEST_FORBIDDEN, '不能封禁管理员')
    return (
      (
        await this._teacherModel.update(staffId, {
          forbidden: isForbidden ? 1 : 0,
        })
      ).affected > 0
    )
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

  async adminUpdateInfo(data: AdminUpdateTeacherDTO): Promise<boolean> {
    try {
      if (data.password) {
        data.password = MD5(data.password).toString()
      } else {
        delete data['password']
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { staffId, ...tmp } = data
      const res = await this._teacherModel.update(data.staffId, tmp)
      return res.affected === 1
    } catch (e: any) {
      console.log(e)
      return false
    }
  }

  async changePassword(
    data: UpdatePasswordDTO
  ): Promise<[ok: boolean, res: any]> {
    try {
      const { password } = await this._teacherModel.findOne(data.staffId)
      if (password !== MD5(data.oldPassword).toString())
        throw new Error('old password wrong')
      const res = await this._teacherModel.update(data.staffId, {
        password: MD5(data.password).toString(),
      })
      return [res.affected === 1, null]
    } catch (e: any) {
      console.log(e)
      return [false, e]
    }
  }
}
