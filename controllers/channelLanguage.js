const models = require('../models')

module.exports = {
  create(req, res) {
    return models.ChannelLanguage
      .create({
        channel_id: req.body.channel_id,
        language: req.body.text
      })
      .then(ChannelLanguage => res.status(201).send(ChannelLanguage))
      .catch(error => res.status(400).send(error))
  }
}