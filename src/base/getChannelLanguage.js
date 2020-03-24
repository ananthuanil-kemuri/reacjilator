import config from './../config'
const models = require('../models/')

module.exports = async channel_id => {
  const matchedChannelLanguage = await models.ChannelLanguage.findOne({
    where: {
      channel_id
    },
    attributes: ['channel_id', 'language']
  })
  if (!matchedChannelLanguage) return config.defaultLanguage
  return matchedChannelLanguage.language
}
