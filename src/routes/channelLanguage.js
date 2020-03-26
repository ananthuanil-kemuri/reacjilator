import { channelLanguage as channelLanguageController } from '../controllers'

export default function(app, services) {
  app.post('/api/channelLanguage', (req, res) =>
    channelLanguageController(req, res, services)
  )
}
