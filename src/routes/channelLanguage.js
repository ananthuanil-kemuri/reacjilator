const channelLanguageController = require('../controllers').channelLanguage

module.exports = app => {
  app.post('/api/channelLanguage', channelLanguageController.create)
}
