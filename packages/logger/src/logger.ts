import { LoggerPlugin } from './plugins/index.js'

export enum LOG_LEVEL {
  ERROR = 'error',
  WARN = 'warn',
  SUCCESS = 'success',
  INFO = 'info',
  DEBUG = 'debug',
}

const LOG_LEVEL_NUMERIC = {
  [LOG_LEVEL.ERROR]: 1,
  [LOG_LEVEL.WARN]: 2,
  [LOG_LEVEL.SUCCESS]: 2,
  [LOG_LEVEL.INFO]: 3,
  [LOG_LEVEL.DEBUG]: 4,
} as const

const LOG_PREFIX = {
  [LOG_LEVEL.ERROR]: '🔴 ',
  [LOG_LEVEL.WARN]: '🟡 ',
  [LOG_LEVEL.SUCCESS]: '🟢 ',
  [LOG_LEVEL.INFO]: '🔵 ',
  [LOG_LEVEL.DEBUG]: '⚫ ',
} as const

type IntLogLevels = (typeof LOG_LEVEL_NUMERIC)[keyof typeof LOG_LEVEL_NUMERIC]
type Loggable = string | number | boolean | null | undefined

export class Logger {
  #level: IntLogLevels = LOG_LEVEL_NUMERIC[LOG_LEVEL.WARN]
  #highestLevelLogged: IntLogLevels = LOG_LEVEL_NUMERIC[LOG_LEVEL.DEBUG]
  #header = 'LOG OUTPUT'
  #filteredLog: string[] = []
  #verboseLog: string[] = []
  #plugins: LoggerPlugin[]

  constructor(plugins?: LoggerPlugin[]) {
    this.#plugins = plugins ?? []

    // Set log level from environment variable if it is defined.
    if (
      process?.env?.LOG_LEVEL &&
      Object.values(LOG_LEVEL).includes(process?.env?.LOG_LEVEL as LOG_LEVEL)
    ) {
      this.setLogLevel(process?.env?.LOG_LEVEL as LOG_LEVEL)
    }
  }

  #log(level: LOG_LEVEL, ...logs: Loggable[]) {
    const prefix = LOG_PREFIX[level] || LOG_PREFIX[LOG_LEVEL.INFO]

    // @ts-expect-error Bit of an ad-hoc mapping to the console log functions.
    const consoleLog = console[level.toLowerCase()] ?? console.log
    consoleLog(prefix, ...logs)

    this.#verboseLog.push([prefix, ...logs].join(' '))

    if (LOG_LEVEL_NUMERIC[level] <= this.#level) {
      this.#filteredLog.push([prefix, ...logs].join(' '))
    }

    if (LOG_LEVEL_NUMERIC[level] <= this.#highestLevelLogged) {
      this.#highestLevelLogged = LOG_LEVEL_NUMERIC[level]
    }
  }

  setLogLevel(level: LOG_LEVEL) {
    this.#log(LOG_LEVEL.DEBUG, `Setting log level to "${level}"`)
    this.#level = LOG_LEVEL_NUMERIC[level]
  }

  setHeader(header: string) {
    this.#header = header
  }

  debug(...logs: Loggable[]) {
    this.#log(LOG_LEVEL.DEBUG, ...logs)
  }

  info(...logs: Loggable[]) {
    this.#log(LOG_LEVEL.INFO, ...logs)
  }

  warn(...logs: Loggable[]) {
    this.#log(LOG_LEVEL.WARN, ...logs)
  }

  success(...logs: Loggable[]) {
    this.#log(LOG_LEVEL.SUCCESS, ...logs)
  }

  error(...logs: Loggable[]) {
    this.#log(LOG_LEVEL.ERROR, ...logs)
  }

  async flush() {
    await Promise.all(
      this.#plugins
        .filter(
          (plugin) =>
            LOG_LEVEL_NUMERIC[plugin.level] >= this.#highestLevelLogged,
        )
        .map((plugin) => plugin.push(this.#header, [...this.#filteredLog])),
    )
    this.clear()
  }

  async flushAll() {
    await Promise.all(
      this.#plugins.map((plugin) =>
        plugin.push(this.#header, [...this.#verboseLog]),
      ),
    )
    this.clear()
  }

  clear() {
    this.#filteredLog.length = 0
    this.#verboseLog.length = 0
  }
}
