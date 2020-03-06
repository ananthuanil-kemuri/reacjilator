const config = require('./../config')
const models = require('../models/')


module.exports = async (channel_id) => {
  const matchedSlackChannelLanguage = await models.SlackChannelLanguage.findOne({
    where: {
      channel_id
    },
    attributes: ['channel_id', 'language']
  })
  if (!matchedSlackChannelLanguage) return config.defaultLanguage
  return matchedSlackChannelLanguage.language
}
