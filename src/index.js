const express = require('express')
const dotenv = require('dotenv')

const setupBodyParser = require('./base/setupBodyParser')
import services from './services'

dotenv.config()

const googleCloudService = new services.GoogleCloudService()
const slackService = new services.SlackService()

const serviceInstances = {
  googleCloudService,
  slackService
}

const app = express()

setupBodyParser(app)
require('./routes')(app, serviceInstances)

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    'Express server listening on port %d in %s mode',
    server.address().port,
    app.settings.env
  )
})
