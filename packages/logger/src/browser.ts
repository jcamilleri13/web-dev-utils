import { LOG_LEVEL, Loggable, LoggerPlugin } from './types.js'

export class Logger {
  constructor(plugins?: LoggerPlugin[]) {}

  setLogLevel(level: LOG_LEVEL) {}
  setHeader(header: string) {}

  debug(...logs: Loggable[]) {}
  info(...logs: Loggable[]) {}
  warn(...logs: Loggable[]) {}
  success(...logs: Loggable[]) {}
  error(...logs: Loggable[]) {}

  async flush() {}
  async flushAll() {}
  clear() {}
}
