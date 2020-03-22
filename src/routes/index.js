import events from './events'
const channelLanguage = require('./channelLanguage')

module.exports = app => {
  app.get('/api', (req, res) =>
    res.status(200).send({
      message: 'Welcome to the Slack Translator API!'
    })
  )
  events(app)
  channelLanguage(app)
}
