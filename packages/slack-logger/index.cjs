const got = require('got')

const { SLACK_WEBHOOK } = process.env
const DEFAULT_LOG_LEVEL = 2

let _header
let _level = DEFAULT_LOG_LEVEL
const _log = []
const _verboseLog = []

const LOG_PREFIX = {
  debug: '⚫ *[DEBUG]*',
  info: '🔵 *[INFO]*',
  warning: '🟡 *[WARNING]*',
  error: '🔴 *[ERROR]*',
  success: '🟢 *[SUCCESS]*'
}

const LOG_LEVEL = {
  error: 1,
  warning: 2,
  success: 2,
  info: 3,
  debug: 4
}

function log(level, ...logs) {
  const prefix = LOG_PREFIX[level] || LOG_PREFIX['info']

  console[level === 'error' ? 'error' : 'log'](prefix, ...logs)

  _verboseLog.push([prefix, ...logs].join(' '))

  if (LOG_LEVEL[level] <= _level) {
    _log.push([prefix, ...logs].join(' '))
  }
}

function setLogLevel(level) {
  log('debug', `Setting log level to "${level}"`)
  _level = LOG_LEVEL[level] || DEFAULT_LOG_LEVEL
}

function setHeader(text) {
  _header = text
}

async function pushToSlack(logs) {
  if (logs.length === 0) return

  await got(SLACK_WEBHOOK, {
    method: 'POST',
    json: {
      text: _log.join('\n'),
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: _header
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: logs.join('\n')
          }
        }
      ]
    }
  })

  logs = []
}

log.flush = () => pushToSlack(_log)
log.flushAll = () => pushToSlack(_verboseLog)
log.setHeader = setHeader
log.setLogLevel = setLogLevel

log.debug = (...logs) => log('debug', ...logs)
log.info = (...logs) => log('info', ...logs)
log.warning = (...logs) => log('warning', ...logs)
log.error = (...logs) => log('error', ...logs)
log.success = (...logs) => log('success', ...logs)

// Set log level from environment variable if it is defined.
setLogLevel(process.env.LOG_LEVEL)

module.exports = log
