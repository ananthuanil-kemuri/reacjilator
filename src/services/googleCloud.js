const { Translate } = require('@google-cloud/translate').v2
import 'core-js/stable'
import 'regenerator-runtime/runtime'

export class GoogleCloudService {
  credentials = {
    projectId: process.env.GOOGLE_PROJECT_ID,
    key: process.env.GOOGLE_TRANSLATE_API_KEY
  }
  googleTranslateClient = undefined
  constructor() {
    this.googleTranslateClient = new Translate({ ...this.credentials })
  }
  async detectLanguage(text) {
    const detectedLangResp = await this.googleTranslateClient
      .detect(text)
      .catch(err => console.error(JSON.stringify(err, null, 2)))
    console.log(
      `detectedLang: ${detectedLangResp[0].language}, confidence: ${detectedLangResp[0].confidence}`
    )
    return detectedLangResp[0].language
  }
  async translate(text, targetLanguage) {
    const translationResp = await this.googleTranslateClient
      .translate(text, targetLanguage)
      .catch(err => console.error(err))
    console.log(`Translated text: ${translationResp[0]}`)
    return {
      translation: translationResp[0],
      sourceLanguage:
        translationResp[1].data.translations[0].detectedSourceLanguage
    }
  }
}
