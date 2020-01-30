const formatText = (text) => {
  let formattedText = formatTextForMentions(text);
  formattedText = formatTextForEmojis(formattedText);
  return formattedText;
}

const formatTextForMentions = (text) => {
  // To format user mentions correctly, they need to be of form "<@U024BE7LH>": https://api.slack.com/reference/surfaces/formatting#mentioning-users
  const formatForUserMentions = (text) => text.replace(/<@ /g, '<@');
  // Links to public channels should look like "<#C024BE7LR>" or "<#C024BE7LR|some-channel>"
  const formatForChannelMentions = (text) => text.replace(/<# [A-Z0-9].* \| [a-zA-z0-9-].*>/g, stripWhitespace);
  // @here and @channel should look like <!here> and <!channel>, respectively
  const formatForSpecialMentions = (text) => text.replace(/<! (here|channel)>/, stripWhitespace);
  return formatForSpecialMentions(formatForChannelMentions(formatForUserMentions(text)));
}

const formatTextForEmojis = (text) => {
  return text.replace(/: [a-z_]*:/, stripWhitespace);
};

const stripWhitespace = (text) => text.replace(/\s/g, '');

module.exports = { formatText };