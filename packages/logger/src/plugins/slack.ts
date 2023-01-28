import got from 'got'

import { LoggerPlugin } from '../index.js'

export class SlackPlugin implements LoggerPlugin {
  #webhook: string

  constructor(webhook: string) {
    this.#webhook = webhook
  }

  async push(header: string, logs: string[]) {
    if (logs.length === 0) return

    try {
      await got(this.#webhook, {
        method: 'POST',
        json: {
          text: logs.join('\n'),
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: header,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: logs.join('\n'),
              },
            },
          ],
        },
      })
    } catch (e) {
      console.error(e)
    }
  }
}
