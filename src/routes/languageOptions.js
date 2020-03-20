module.exports = (app) => {
  app.get('/api/languageOptions', (req, res) => {
    res.send({
      "options": [
        {
          "text": {
            "type": "plain_text",
            "text": "English"
          },
          "value": "en"
        },
        {
          "text": {
            "type": "plain_text",
            "text": "Mandarin"
          },
          "value": "zh-CN"
        },
      ]
    }).sendStatus(200)
  })
}