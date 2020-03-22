const langCodeLookup = {
  'zh-CN': 'Mandarin',
  'zh-TW': 'Mandarin (Traditional)',
  en: 'English'
}

const langCodeToName = langCode => {
  return langCodeLookup[langCode] || langCode
}

module.exports = langCodeToName
