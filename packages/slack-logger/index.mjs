import got from 'got'

const { SLACK_WEBHOOK } = process.env

let _header
const _log = []

const LOG_PREFIX = {
  info: '🔵 *[INFO]*',
  warning: '🟡 *[WARNING]*',
  error: '🔴 *[ERROR]*',
  success: '🟢 *[SUCCESS]*'
}

function log (level,  ...logs) {
  const prefix = LOG_PREFIX[level] || LOG_PREFIX['info']

  console[level === 'error' ? 'error' : 'log'](prefix, ...logs)
  _log.push([prefix, ...logs].join(' '))
}

function setHeader (text) {
  _header = text
}

async function flush () {
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

log.info = (...logs) => log('info', ...logs)
log.warning = (...logs) => log('warning', ...logs)
log.error = (...logs) => log('error', ...logs)
log.success = (...logs) => log('success', ...logs)

export default log
