const models = require('../models')

const allowedSlackLanguageChoicesToLangCode = {
  'english': 'en',
  'chinese': 'zh-CN'
}

class InvalidSlackLanguage extends Error {
  constructor(message) {
    super(message)
  }
}

module.exports = {
  create(req, res) {
    return models.ChannelLanguage
      .findOrCreate({
        where: {
          channel_id: req.body.channel_id,
        }
      })
      .then(([channelLanguage, created]) => {
        const slackLangChoice = req.body.text
        if (!Object.keys(allowedSlackLanguageChoicesToLangCode).includes(slackLangChoice)) {
          throw new InvalidSlackLanguage(`${slackLangChoice} is not a valid language choice!`)
        }
        channelLanguage.update({language: allowedSlackLanguageChoicesToLangCode[slackLangChoice] })
          .then(() => res.status(201).send(channelLanguage))
      })
      .catch(error => {
        console.error(error)
        res.status(400).send(error)
      })
  }
}