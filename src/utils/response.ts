import { ErrorMap, ErrorType } from './errorType';

export class R {
  code: number;
  msg: string;
  data = null;

  constructor(code: number, msg: string, data: any) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  Code(code: number): R {
    this.code = code;
    return this;
  }

  Data(data: any): R {
    this.data = data;
    return this;
  }

  Msg(msg: string): R {
    this.msg = msg;
    return this;
  }

  static Ok(): R {
    return new R(0, 'success', null);
  }

  static Fail(): R {
    return new R(-1, 'fail', null);
  }

  static WrapError(errorType: ErrorType): R {
    const err = ErrorMap[errorType];
    return this.Fail().Code(err.code).Msg(err.msg);
  }
}
