const models = require('../models')

export const allowedSlackLanguageChoicesToLangCode = {
  english: 'en',
  chinese: 'zh-CN'
}

export default function createOrUpdate(req, res, services) {
  const slackLangChoice = req.body.text
  return models.ChannelLanguage.findOrCreate({
    where: {
      channel_id: req.body.channel_id
    }
  })
    .then(async ([channelLanguage]) => {
      if (
        !Object.keys(allowedSlackLanguageChoicesToLangCode).includes(
          slackLangChoice
        )
      ) {
        // Returning 500 displays in Slack as "/language failed with the error "http_service_error"
        return res
          .status(201)
          .send(`${slackLangChoice} is not a valid language choice!`)
      }
      channelLanguage
        .update({
          language: allowedSlackLanguageChoicesToLangCode[slackLangChoice]
        })
        .then(() => res.status(201).send(''))
      const successMsg = `Set channel language to ${slackLangChoice}!`
      await services.slackService.postMessage(
        successMsg,
        null,
        req.body.channel_id,
        [],
        false
      )
    })
    .catch(error => {
      console.error(error)
      res.status(400).send(error)
    })
}
