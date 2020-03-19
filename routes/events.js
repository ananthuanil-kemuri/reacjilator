const axios = require('axios'); 
const qs = require('qs');
const {Translate} = require('@google-cloud/translate').v2;

const getChannelLanguage = require('../base/getChannelLanguage')
const langCodeToName = require('../langCodeToName');
const signature = require('./verifySignature');
const { formatText } = require('../base/formatting');
const { slackAPIURL } = require('../config')

const googleCredentials = {
  projectId: process.env.GOOGLE_PROJECT_ID,
  key: process.env.GOOGLE_KEY
};
const googTranslate = new Translate({ ...googleCredentials });

const eventsRoute = (app) => {
  app.post('/events', (req, res) => {
    switch (req.body.type) {
      case 'url_verification': {
        // verify Events API endpoint by returning challenge if present
        res.send({ challenge: req.body.challenge });
        break;
      }
      case 'event_callback': {
        // Verify the signing secret
        if (!signature.isVerified(req)) {
          res.sendStatus(404);
          return;
        } else {
          res.sendStatus(200);
          return events(req, res);
        }
        break;
      }
      default: { res.sendStatus(404); }
    }
  });
}

const events = async(req, res) => {
  const {attachments, bot_id, channel, hidden, subtype, text, thread_ts, ts, type} = req.body.event;
    console.log(`req.body.event: ${JSON.stringify(req.body.event, null, 2)}`);
    if (type !== 'message') return;
    // Exclude handling of messages for message updates etc and hidden messages
    if (bot_id || subtype || hidden) return;

    // Matching ISO 639-1 language code
    let parent_msg_ts, is_in_thread;
    if (thread_ts) {
      const messages = await getThreadMessages(channel, thread_ts);
      const parentMsg = messages.find(msg => msg.ts === thread_ts);
      parent_msg_ts = parentMsg.ts;
      is_in_thread = true
    } else {
      parent_msg_ts = ts;
    }
    const targetLang = await getChannelLanguage(channel)
    if (await doesMessageNeedTranslating(text, attachments, targetLang)) {
      postTranslatedMessage(text, parent_msg_ts, targetLang, channel, is_in_thread, attachments);
    }
};

const getThreadMessages = async(channel, ts) => { 
  const args = {
    token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
    channel,
    ts: ts,
    limit: 1,
    inclusive: true
  };
  const result = await axios.post(`${slackAPIURL}/conversations.replies`, qs.stringify(args));
  if (!result.data.ok) throw JSON.stringify(result.data)
  return result.data.messages;
};

const doesMessageNeedTranslating = async(text, attachments, targetLang) => {
  // Check if sharing msg from another channel
  const textToCheck = text ? text : attachments[0].text;
  const detectedLangResp = await googTranslate.detect(textToCheck)
    .catch(err => console.error(JSON.stringify(err, null, 2)));
  console.log(`detectedLang: ${JSON.stringify(detectedLangResp, null, 2)}`);
  const detectedLang = detectedLangResp[0].language;
  return compareDetectedTargetLang(detectedLang, targetLang)
};

const postTranslatedMessage = async(origText, ts, targetLang, channel, is_in_thread, origAttachments) => {
  try {
    if (origText) {
      const { translation, sourceLanguage } = await translateText(origText, targetLang);
      const footerText = `Translated from ${langCodeToName(sourceLanguage)} to ${langCodeToName(targetLang)}`;
      const attachments = [{
        text: origText,
        footer: footerText,
      }]
      postMessage(translation, ts, channel, attachments, is_in_thread);
    } else {
      // Handle shared msg from another channel
      const sharedMsg = origAttachments[0].text;
      const { translation, sourceLanguage } = await translateText(sharedMsg, targetLang);
      const footerText = `Translated from ${langCodeToName(sourceLanguage)} to ${langCodeToName(targetLang)}`;
      const attachments = [{
        text: sharedMsg,
        footer: footerText,
      }]
      postMessage(translation, ts, channel, attachments, is_in_thread);
    }
  } catch (err) {
    console.error('postTranslatedMessage error in channel: ', channel)
    console.error(err);
  }
};

const postMessage = async(text, ts, channel, attachments, is_in_thread) => {
  const args = {
    attachments: JSON.stringify(attachments),
    channel,
    link_names: true,
    text: formatText(text),
    token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
  };
  if (is_in_thread) {
    args.thread_ts = ts;
  } else {
    args.ts = ts;
  }
  const result = await axios.post(`${slackAPIURL}/chat.postMessage`, qs.stringify(args));
  console.log('channel', channel);
  try {
    console.log('postMessage result.data', result.data);
  } catch(e) {
    console.log(e);
  }
};

const translateText = async(text, targetLang) => {
  const translationResp = await googTranslate.translate(text, targetLang)
    .catch(err => console.error(err));
  console.log(JSON.stringify(translationResp[1], null, 2));
  return {
    translation: translationResp[0],
    sourceLanguage: translationResp[1].data.translations[0].detectedSourceLanguage
  };
}

function compareDetectedTargetLang (detectedLang, targetLang) {
  if (detectedLang === 'und') return false
  return targetLang !== detectedLang;
}

module.exports = eventsRoute
