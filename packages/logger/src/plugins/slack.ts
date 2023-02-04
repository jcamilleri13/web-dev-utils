import { BasePlugin } from './base-plugin.js'

export class SlackPlugin extends BasePlugin {
  #webhook: string

  constructor(webhook: string) {
    super()

    this.#webhook = webhook
  }

  async push(header: string, logs: string[]) {
    if (logs.length === 0) return

    try {
      await fetch(this.#webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      })
    } catch (e) {
      console.error(e)
    }
  }
}
