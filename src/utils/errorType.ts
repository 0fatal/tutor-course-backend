export enum ErrorType {
  REQUEST_FORBIDDEN = 0,
  SERVER_ERROR,
  UNAUTHORIZED,
  LOGIN_FAILED,
}

export const ErrorMap: {
  [key in ErrorType]: {
    code: number
    msg: string
  }
} = {
  [ErrorType.REQUEST_FORBIDDEN]: {
    code: 40300,
    msg: 'request forbidden',
  },
  [ErrorType.SERVER_ERROR]: {
    code: 50000,
    msg: 'server error',
  },
  [ErrorType.UNAUTHORIZED]: {
    code: 40100,
    msg: 'unauthorized',
  },
  [ErrorType.LOGIN_FAILED]: {
    code: 40201,
    msg: 'wrong staffId or password',
  },
}
