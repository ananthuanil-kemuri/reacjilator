const axios = require('axios'); 
const qs = require('qs');
const {Translate} = require('@google-cloud/translate').v2;

const langCodeToName = require('./langCodeToName');
const signature = require('./verifySignature');

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
    const {bot_id, channel, hidden, subtype, ts, type} = req.body.event;
      console.log(`req.body.event: ${JSON.stringify(req.body.event)}`);
      if (type !== 'message') return;
      // Exclude handling of messages for message updates etc and hidden messages
      if (bot_id || subtype || hidden) return;
  
      // Matching ISO 639-1 language code
      const targetLang = 'en';
  
      let messages = await getMessage(channel, ts); 
      const message = messages[0];
      if (await doesMessageNeedTranslating(message.text, targetLang)) {
        postTranslatedMessage(message, targetLang, channel);
      }
  };
  
  const getMessage = async(channel, ts) => { 
    const args = {
      token: process.env.SLACK_ACCESS_TOKEN,
      channel: channel,
      ts: ts,
      limit: 1,
      inclusive: true
    };
    
    const result = await axios.post(`${slackAPIURL}/conversations.replies`, qs.stringify(args));
    
    try {
      return result.data.messages; 
    } catch(e) {
      console.log(e);
    }
  };
  
  const doesMessageNeedTranslating = async(text, targetLang) => {
    const detectedLangResp = await googTranslate.detect(text)
      .catch(err => console.error(JSON.stringify(err)));
    console.log(`detectedLang: ${JSON.stringify(detectedLangResp)}`);
    const detectedLang = detectedLangResp[0].language;
    return targetLang !== detectedLang;
  };

  const postMessage = async(message, text, channel, attachments) => {
    const {ts} = message;
    const args = {
      attachments: JSON.stringify(attachments),
      channel,
      text,
      ts,
      token: process.env.SLACK_ACCESS_TOKEN,
    };
    const result = await axios.post(`${slackAPIURL}/chat.postMessage`, qs.stringify(args));
    try {
      console.log(result.data);
    } catch(e) {
      console.log(e);
    }
  };

  const postTranslatedMessage = async(message, targetLang, channel) => {
    try {
      const { translation, sourceLanguage } = await translateMessage(message, targetLang);
      const footerText = `Translated from ${langCodeToName[sourceLanguage]} to ${langCodeToName[targetLang]}`;
      const attachments = [{
        text: message.text,
        footer: footerText,
      }]
      postMessage(message, translation, channel, attachments);
    } catch (err) {
      console.log(err);
    }
  };

  const translateMessage = async(message, targetLang) => {
    const translationResp = await googTranslate.translate(message.text, targetLang)
      .catch(err => console.error(err));
    console.log(JSON.stringify(translationResp[1]));
    return {
      translation: translationResp[0],
      sourceLanguage: translationResp[1].data.translations[0].detectedSourceLanguage
    };
  }
}

module.exports = setupEventsRoute
