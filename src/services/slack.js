const axios = require('axios')
const qs = require('qs')

const { formatText } = require('../base/formatting')

import config from '../config'

export class SlackService {
  apiURL = config.slackAPIURL
  botAccessToken = process.env.SLACK_BOT_USER_ACCESS_TOKEN
  async getThreadMessages(channel, ts) {
    const args = {
      token: this.botAccessToken,
      channel,
      ts,
      limit: 1,
      inclusive: true
    }
    let result
    try {
      result = await axios.post(
        `${this.apiURL}/conversations.replies`,
        qs.stringify(args)
      )
    } catch (err) {
      throw new Error(`Failed to query thread messages: ${err.message}`)
    }
    if (!result.data.ok) throw JSON.stringify(result.data)
    return result.data.messages
  }
  async postMessage(text, ts, channel, attachments, is_in_thread) {
    const args = {
      attachments: JSON.stringify(attachments),
      channel,
      link_names: true,
      text: formatText(text),
      token: this.botAccessToken
    }
    if (is_in_thread) {
      args.thread_ts = ts
    } else {
      args.ts = ts
    }
    let result
    try {
      result = await axios.post(
        `${this.apiURL}/chat.postMessage`,
        qs.stringify(args)
      )
      console.log(`Sent message: ${result.data.message.text}`)
    } catch (err) {
      throw new Error(
        `Failed to send message: ${result.data.message.text}, error: ${err.message}`
      )
    }
    return result
  }
}
