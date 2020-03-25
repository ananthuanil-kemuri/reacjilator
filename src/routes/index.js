import events from './events'
import channelLanguage from './channelLanguage'
import interactivity from './interactivity'

module.exports = (app, services) => {
  app.get('/api', (req, res) =>
    res.status(200).send({
      message: 'Welcome to the Slack Translator API!'
    })
  )
  events(app, services)
  channelLanguage(app, services)
  interactivity(app, services)
}
