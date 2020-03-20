'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChannelLanguage = sequelize.define('ChannelLanguage', {
    channel_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    language: DataTypes.STRING
  }, {});
  ChannelLanguage.associate = function(models) {
    // associations can be defined here
  };
  return ChannelLanguage;
};