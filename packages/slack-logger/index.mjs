import got from 'got'

const { SLACK_WEBHOOK } = process.env
const DEFAULT_LOG_LEVEL = 2

let _header
let _level = DEFAULT_LOG_LEVEL
const _log = []

const LOG_PREFIX = {
  debug: '⚫ *[DEBUG]*',
  info: '🔵 *[INFO]*',
  warning: '🟡 *[WARNING]*',
  error: '🔴 *[ERROR]*',
  success: '🟢 *[SUCCESS]*'
}

const LOG_LEVEL = {
  error: 0,
  warning: 1,
  success: 1,
  info: 2,
  debug: 3
}

function log (level,  ...logs) {
  const prefix = LOG_PREFIX[level] || LOG_PREFIX['info']

  console[level === 'error' ? 'error' : 'log'](prefix, ...logs)

  if (LOG_LEVEL[level] <= _level)  {
    _log.push([prefix, ...logs].join(' '))
  }
}

function setLogLevel (level) {
  _level = LOG_LEVEL[level] || DEFAULT_LOG_LEVEL
}

function setHeader (text) {
  _header = text
}

async function flush () {
  if (_log.length === 0) return

  await got(SLACK_WEBHOOK, {
    method: 'POST',
    json: {
      text: _log.join('\n'),
      blocks: [{
        'type': 'header',
        'text': {
          'type': 'plain_text',
          'text': _header
        }
      }, {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': _log.join('\n')
        }
      }]
    }
  })
}

log.flush = flush
log.setHeader = setHeader
log.setLogLevel = setLogLevel

log.debug = (...logs) => log('debug', ...logs)
log.info = (...logs) => log('info', ...logs)
log.warning = (...logs) => log('warning', ...logs)
log.error = (...logs) => log('error', ...logs)
log.success = (...logs) => log('success', ...logs)

// Set log level from environment variable if it is defined.
setLogLevel(process.env.LOG_LEVEL)

export default log
