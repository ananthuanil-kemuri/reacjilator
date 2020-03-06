const { slackAPIURL } = require('./../config')
const events = require('./events')
const slackChannelLanguageController = require('../controllers').slackChannelLanguage

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
      message: 'Welcome to the Slack Translator API!'
  }))
  app.post('/api/slackChannelLanguage', slackChannelLanguageController.create)
  events(app, slackAPIURL);
}