import { channelLanguage as channelLanguageController } from '../controllers'

export default function (app) {
  app.post('/api/channelLanguage', channelLanguageController.create)
}
