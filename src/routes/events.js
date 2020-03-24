const getChannelLanguage = require('../base/getChannelLanguage')
const langCodeToName = require('../langCodeToName')
const signature = require('./verifySignature')

export default function eventsRoute(app, services) {
  app.post('/events', (req, res) => {
    switch (req.body.type) {
      case 'url_verification': {
        // verify Events API endpoint by returning challenge if present
        res.send({ challenge: req.body.challenge })
        break
      }
      case 'event_callback': {
        // Verify the signing secret
        if (!signature.isVerified(req)) {
          res.sendStatus(404)
          return
        } else {
          res.sendStatus(200)
          return events(req, res, services)
        }
        break
      }
      default: {
        res.sendStatus(404)
      }
    }
  })
}

const events = async (req, res, services) => {
  const {
    attachments,
    bot_id,
    channel,
    hidden,
    subtype,
    text,
    thread_ts,
    ts,
    type
  } = req.body.event
  console.log(`req.body.event: ${JSON.stringify(req.body.event, null, 2)}`)
  if (type !== 'message') return
  // Exclude handling of messages for bot msgs including translation, message updates and hidden messages
  if (bot_id || subtype || hidden) return
  const { parent_msg_ts, is_in_thread } = await getParentMsgTsAndIsInthread(thread_ts, ts, channel, services)
  const targetLang = await getChannelLanguage(channel)
  if (
    await doesMessageNeedTranslating(text, attachments, targetLang, services)
  ) {
    await postTranslatedMessage(
      text,
      parent_msg_ts,
      targetLang,
      channel,
      is_in_thread,
      attachments,
      services
    )
  }
}

const getParentMsgTsAndIsInthread = async (thread_ts, ts, channel, services) => {
  let parent_msg_ts, is_in_thread
  if (thread_ts) {
    let messages
    messages = await services.slackService.getThreadMessages(
      channel,
      thread_ts
    )
    const parentMsg = messages.find(msg => msg.ts === thread_ts)
    parent_msg_ts = parentMsg.ts
    is_in_thread = true
  } else {
    parent_msg_ts = ts
  }
  return {
    parent_msg_ts,
    is_in_thread
  }
}

const doesMessageNeedTranslating = async (
  text,
  attachments,
  targetLang,
  services
) => {
  // Check if sharing msg from another channel
  const textToCheck = text ? text : attachments[0].text
  const detectedLang = await services.googleCloudService.detectLanguage(
    textToCheck
  )
  return compareDetectedTargetLang(detectedLang, targetLang)
}

const postTranslatedMessage = async (
  origText,
  ts,
  targetLang,
  channel,
  is_in_thread,
  origAttachments,
  services
) => {
  try {
    if (origText) {
      const {
        translation,
        sourceLanguage
      } = await services.googleCloudService.translate(origText, targetLang)
      const footerText = `Translated from ${langCodeToName(
        sourceLanguage
      )} to ${langCodeToName(targetLang)}`
      const attachments = [
        {
          text: origText,
          footer: footerText
        }
      ]
      return await services.slackService.postMessage(
        translation,
        ts,
        channel,
        attachments,
        is_in_thread
      )
    } else {
      // Handle shared msg from another channel
      const sharedMsg = origAttachments[0].text
      const {
        translation,
        sourceLanguage
      } = await services.googleCloudService.translate(sharedMsg, targetLang)
      const footerText = `Translated from ${langCodeToName(
        sourceLanguage
      )} to ${langCodeToName(targetLang)}`
      const attachments = [
        {
          text: sharedMsg,
          footer: footerText
        }
      ]
      return await services.slackService.postMessage(
        translation,
        ts,
        channel,
        attachments,
        is_in_thread
      )
    }
  } catch (err) {
    console.error('postTranslatedMessage error in channel: ', channel)
    console.error(err)
  }
}

function compareDetectedTargetLang(detectedLang, targetLang) {
  if (detectedLang === 'und') return false
  return targetLang !== detectedLang
}
