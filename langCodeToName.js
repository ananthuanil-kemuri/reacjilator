const langCodeLookup = {
  'zh-CN': 'Mandarin',
  'en': 'English'
};

const langCodeToName = (langCode) => {
  return langCodeLookup[langCode] || langCode
};

module.exports = langCodeToName