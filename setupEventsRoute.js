const axios = require('axios'); 
const qs = require('qs');
const {Translate} = require('@google-cloud/translate').v2;

const langCodeToName = require('./langCodeToName');
const signature = require('./verifySignature');
const { formatText } = require('./base/formatting');

const setupEventsRoute = (app, slackAPIURL) => {
  const googleCredentials = {
    projectId: process.env.GOOGLE_PROJECT_ID,
    key: process.env.GOOGLE_KEY
  };
  const googTranslate = new Translate({ ...googleCredentials });

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
  const events = async(req, res) => {
    const {bot_id, channel, hidden, subtype, text, thread_ts, ts, type} = req.body.event;
      console.log(`req.body.event: ${JSON.stringify(req.body.event)}`);
      if (type !== 'message') return;
      // Exclude handling of messages for message updates etc and hidden messages
      if (bot_id || subtype || hidden) return;
  
      // Matching ISO 639-1 language code
      const targetLang = 'en';
      let parent_msg_ts, is_in_thread;
      if (thread_ts) {
        const messages = await getMessages(channel, thread_ts);
        const parentMsg = messages.find(msg => msg.ts === thread_ts);
        parent_msg_ts = parentMsg.ts;
        is_in_thread = true
      } else {
        parent_msg_ts = ts
      }
      if (await doesMessageNeedTranslating(text, targetLang)) {
        postTranslatedMessage(text, parent_msg_ts, targetLang, channel, is_in_thread);
      }
  };
  
  const getMessages = async(channel, ts) => { 
    const args = {
      token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
      channel: channel,
      ts: ts,
      limit: 1,
      inclusive: true
    };
    
    const result = await axios.post(`${slackAPIURL}/conversations.replies`, qs.stringify(args));
    if (!result.data.ok) throw JSON.stringify(result.data)
    return result.data.messages;
  };
  
  const doesMessageNeedTranslating = async(text, targetLang) => {
    const detectedLangResp = await googTranslate.detect(text)
      .catch(err => console.error(JSON.stringify(err)));
    console.log(`detectedLang: ${JSON.stringify(detectedLangResp)}`);
    const detectedLang = detectedLangResp[0].language;
    return targetLang !== detectedLang;
  };

  const postTranslatedMessage = async(origText, ts, targetLang, channel, is_in_thread) => {
    try {
      const { translation, sourceLanguage } = await translateText(origText, targetLang);
      const footerText = `Translated from ${langCodeToName(sourceLanguage)} to ${langCodeToName(targetLang)}`;
      const attachments = [{
        text: origText,
        footer: footerText,
      }]
      postMessage(translation, ts, channel, attachments, is_in_thread);
    } catch (err) {
      console.log('post translated msg error', channel)
      console.log(err);
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
    console.log(JSON.stringify(translationResp[1]));
    return {
      translation: translationResp[0],
      sourceLanguage: translationResp[1].data.translations[0].detectedSourceLanguage
    };
  }
}

module.exports = setupEventsRoute
