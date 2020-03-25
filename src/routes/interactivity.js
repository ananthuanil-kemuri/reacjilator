import { allowedSlackLanguageChoicesToLangCode } from './../controllers/channelLanguage'
import { getParentMsgTsAndIsInthread, postTranslatedMessage } from './events'

export default function(app, services) {
  app.post('/api/interactivity', async (req, res) => {
    const payload = JSON.parse(req.body.payload)
    const {
      callback_id,
      channel,
      message: { text, thread_ts, ts }
    } = payload
    switch (callback_id) {
      case 'translate_to_chinese': {
        res.sendStatus(200)
        let parent_msg_ts, is_in_thread
        const threadData = await getParentMsgTsAndIsInthread(
          thread_ts,
          ts,
          channel.id,
          services
        )
        parent_msg_ts = threadData.parent_msg_ts
        is_in_thread = threadData.is_in_thread
        await postTranslatedMessage(
          text,
          parent_msg_ts,
          allowedSlackLanguageChoicesToLangCode.chinese,
          channel.id,
          is_in_thread,
          [],
          services
        )
        break
      }
      default: {
        throw new InvalidInteractivityCallbackId(
          `Invalid callback_id: ${callback_id}`
        )
      }
    }
  })
}

class InvalidInteractivityCallbackId extends Error {}
