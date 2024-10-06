export type Loggable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<PropertyKey, unknown>
  | Error

export enum LOG_LEVEL {
  ERROR = 'error',
  WARN = 'warn',
  SUCCESS = 'success',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LoggerPlugin {
  level: LOG_LEVEL
  push: (header: string, logs: string[]) => Promise<void>
}
