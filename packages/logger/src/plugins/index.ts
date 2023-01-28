import { LOG_LEVEL } from '../logger.js'

export interface LoggerPlugin {
  level: LOG_LEVEL
  push: (header: string, logs: string[]) => Promise<void>
}

export { SlackPlugin } from './slack.js'
export { EmailPlugin } from './email.js'
