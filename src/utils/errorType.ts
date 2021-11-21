export enum ErrorType {
  REQUEST_FORBIDDEN = 0,
  SERVER_ERROR,
}

export const ErrorMap: { [key in ErrorType]: string } = {
  [ErrorType.REQUEST_FORBIDDEN]: 'request forbidden',
  [ErrorType.SERVER_ERROR]: 'server error'
}
