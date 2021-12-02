export interface ErrorType {
  base: {
    REQUEST_FORBIDDEN: {}
    SERVER_ERROR: {}
    UNAUTHORIZED: {}
  }
}

export interface ErrorDefineSingle {
  code: number
  msg: string
}

type UnionToIntersection<U> = (
  U extends any ? (key: U) => void : never
) extends (key: infer I) => void
  ? I
  : never
type Flatten<T, K extends keyof T = keyof T> = UnionToIntersection<T[K]>
type InnerKeys<T, K extends keyof T = keyof T> = keyof Flatten<T> &
  keyof Flatten<T, K>

export type ErrorDefine<
  T extends keyof E,
  E extends { [key: string]: any },
  U extends InnerKeys<E, T> = InnerKeys<E, T>
> = {
  [key in U]: ErrorDefineSingle
}

export const ErrorMap: ErrorDefine<'base', ErrorType> = {
  REQUEST_FORBIDDEN: {
    code: 40300,
    msg: 'request forbidden',
  },
  SERVER_ERROR: {
    code: 50000,
    msg: 'server error',
  },
  UNAUTHORIZED: {
    code: 401000,
    msg: 'unauthorized',
  },
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ErrorType {
  export function is(error: any): boolean {
    return (
      error &&
      typeof error === 'object' &&
      error.hasOwnProperty('code') &&
      error.hasOwnProperty('msg')
    )
  }

  export function convert(error: any): [boolean, ErrorDefineSingle | null] {
    if (ErrorType.is(error)) {
      return [true, error as ErrorDefineSingle]
    }
    return [false, null]
  }

  export function wrap(
    error: ErrorDefineSingle,
    payload?: string
  ): ErrorDefineSingle {
    if (payload) error.msg = `${error.msg}: ${payload}`
    return error
  }
}
