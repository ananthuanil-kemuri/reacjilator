const express = require('express')
const dotenv = require('dotenv')

const setupBodyParser = require('./base/setupBodyParser')

dotenv.config()

const app = express()

setupBodyParser(app)
require('./routes')(app)

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    'Express server listening on port %d in %s mode',
    server.address().port,
    app.settings.env
  )
})
