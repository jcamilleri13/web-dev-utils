import { Logger } from './logger.js'

export { LOG_LEVEL } from './types.js'
export { LoggerPlugin, SlackPlugin } from './plugins/index.js'
export { Logger }
export const log = new Logger()
