'use strict';
module.exports = (sequelize, DataTypes) => {
  const SlackChannelLanguage = sequelize.define('SlackChannelLanguage', {
    channel_id: DataTypes.STRING,
    language: DataTypes.STRING
  }, {});
  SlackChannelLanguage.associate = function(models) {
    // associations can be defined here
  };
  return SlackChannelLanguage;
};