import { LOG_LEVEL } from '../types.js'
import { LoggerPlugin } from './index.js'

export abstract class BasePlugin implements LoggerPlugin {
  level = LOG_LEVEL.DEBUG

  abstract push(header: string, logs: string[]): Promise<void>
}
