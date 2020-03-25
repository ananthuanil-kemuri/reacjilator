import { allowedSlackLanguageChoicesToLangCode } from './../controllers/channelLanguage'
import { getParentMsgTsAndIsInthread, postTranslatedMessage } from './events'

export default function(app, services) {
  app.post('/api/interactivity', async (req, res) => {
    const payload = JSON.parse(req.body.payload)
    switch (payload.callback_id) {
      case 'translate_to_chinese': {
        res.sendStatus(200)
        await handleManualTranslation(
          payload,
          allowedSlackLanguageChoicesToLangCode.chinese,
          services
        )
        break
      }
      default: {
        throw new InvalidInteractivityCallbackId(
          `Invalid callback_id: ${payload.callback_id}`
        )
      }
    }
  })
}

async function handleManualTranslation(payload, targetLanguage, services) {
  const {
    channel,
    message: { text, thread_ts, ts }
  } = payload
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
    targetLanguage,
    channel.id,
    is_in_thread,
    [],
    services
  )
}

class InvalidInteractivityCallbackId extends Error {}
