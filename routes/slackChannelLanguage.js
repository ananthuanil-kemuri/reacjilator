const slackChannelLanguageController = require('../controllers').slackChannelLanguage

module.exports = (app) => {
  app.post('/api/slackChannelLanguage', slackChannelLanguageController.create)
}