const models = require('../models')

const allowedSlackLanguageChoices = [
  'english',
  'chinese'
]

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
        const newLanguage = req.body.text
        if (!allowedSlackLanguageChoices.includes(newLanguage)) {
          throw new InvalidSlackLanguage(`${newLanguage} is not a valid language choice!`)
        }
        channelLanguage.update({language: req.body.text })
          .then(() => res.status(201).send(channelLanguage))
      })
      .catch(error => {
        console.error(error)
        res.status(400).send(error)
      })
  }
}