import { allowedSlackLanguageChoicesToLangCode } from './../controllers/channelLanguage'
import { postTranslatedMessage } from './events'

export default function(app, services) {
  app.post('/api/interactivity', async (req, res) => {
    const payload = JSON.parse(req.body.payload)
    const {
      callback_id,
      channel,
      message: { text, ts }
    } = payload
    switch (callback_id) {
      case 'translate_to_chinese': {
        res.sendStatus(200)
        await postTranslatedMessage(
          text,
          ts,
          allowedSlackLanguageChoicesToLangCode.chinese,
          channel.id,
          false,
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
