const bodyParser = require('body-parser')

const setupBodyParser = app => {
  const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8')
    }
  }

  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }))
  app.use(bodyParser.json({ verify: rawBodyBuffer }))
}

module.exports = setupBodyParser
