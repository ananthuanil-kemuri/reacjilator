const axios = require('axios'); 
const qs = require('qs');
const {Translate} = require('@google-cloud/translate').v2;

const signature = require('./verifySignature');

const apiUrl = 'https://slack.com/api';

const setupEventsRoute = (app) => {
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
  
      // Finding a lang based on a country is not the best way but oh well
      // Matching ISO 639-1 language code
      const targetLang = 'en';
  
      let messages = await getMessage(channel, ts); 
      const message = messages[0];
      if (await doesMessageNeedTranslating(message.text, targetLang)) {
        updateWithTranslatedMessage(message, targetLang, channel);
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
    
    const result = await axios.post(`${apiUrl}/conversations.replies`, qs.stringify(args));
    
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
  
  const updateWithTranslatedMessage = async(message, lang, channel) => {
    try {
      const translation = await translateMessage(message, lang);
      // if(isAlreadyPosted(messages, translation)) return;
      postMessage(message, translation, channel);
      // updateMessage(message, translation, channel);
    } catch (err) {
      console.log(err);
    }
  };

  const postMessage = async(message, updatedText, channel) => {
    const {ts} = message;
    const text = `${updatedText}\n>${message.text}`
    
    const args = {
      as_user: true,
      channel: channel,
      text,
      ts,
      token: process.env.SLACK_ACCESS_TOKEN,
      username: message.user
    };
    
    const result = await axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(args));
    
    try {
      console.log(result.data);
    } catch(e) {
      console.log(e);
    }
  };

  const postTranslatedMessage = async(message, lang, channel) => {
    try {
      const translation = await translateMessage(message, lang);
      // if(isAlreadyPosted(messages, translation)) return;
      postMessage(message, translation, channel);
    } catch (err) {
      console.log(err);
    }
  };
  
  const updateMessage = async(message, updatedText, channel) => {
    const {ts} = message;
    const text = `${updatedText}\n>${message.text}`
    
    const args = {
      as_user: true,
      channel: channel,
      text,
      ts,
      token: process.env.SLACK_ACCESS_TOKEN,
    };
    
    const result = await axios.post(`${apiUrl}/chat.update`, qs.stringify(args));
    
    try {
      console.log(result.data);
    } catch(e) {
      console.log(e);
    }
  };

  const deleteMessage = async(message, channel) => {
    const {ts} = message;
    
    const args = {
      channel: channel,
      ts,
      token: process.env.SLACK_ACCESS_TOKEN,
    };
    
    const result = await axios.post(`${apiUrl}/chat.delete`, qs.stringify(args));
    
    try {
      console.log(result.data);
    } catch(e) {
      console.log(e);
    }
  };

  const translateMessage = async(message, targetLang) => {
    const translationResp = await googTranslate.translate(message.text, targetLang)
      .catch(err => console.error(err));
    console.log(JSON.stringify(translationResp[1]));
    return translationResp[0];
  }
  
  const isAlreadyPosted = (messages, translation) => {
    // To avoid posting same messages several times, make sure if a same message in the thread doesn't exist
    let alreadyPosted = false;
    messages.forEach(messageInTheThread => {
      if (!alreadyPosted && messageInTheThread.subtype && messageInTheThread.attachments[0].text === translation) {
        alreadyPosted = true;
      }
    });
    if (alreadyPosted) {
      return true;
    }
  };
}

module.exports = setupEventsRoute
