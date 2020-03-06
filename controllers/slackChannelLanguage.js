const SlackChannelLanguage = require('../models/slackchannellanguage').SlackChannelLanguage

module.exports = {
  create(req, res) {
    return SlackChannelLanguage
      .create({
        channel_id: req.body.channel_id,
        language: req.body.language
      })
      .then(slackChannelLanguage => res.status(201).send(slackChannelLanguage))
      .catch(error => res.status(400).send(error))
  }
}