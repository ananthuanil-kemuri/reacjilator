import config from './../config'
const models = require('../models/')

export default async channel_id => {
  let matchedChannelLanguage
  try {
    matchedChannelLanguage = await models.ChannelLanguage.findOne({
      where: {
        channel_id
      },
      attributes: ['channel_id', 'language']
    })
  } catch (err) {
    throw new Error(`Failed to query ChannelLanguage: ${err.message}`)
  }
  if (!matchedChannelLanguage) {
    console.error(`Couldnt find matching language, defaulting to ${config.defaultLanguage}`)
    return config.defaultLanguage
  }
  return matchedChannelLanguage.language
}
