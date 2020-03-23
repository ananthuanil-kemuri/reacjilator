const { Translate } = require('@google-cloud/translate').v2

export class GoogleCloudService {
  credentials = {
    projectId: process.env.GOOGLE_PROJECT_ID,
    key: process.env.GOOGLE_KEY
  }
  googleTranslateClient = undefined
  constructor() {
    this.googleTranslateClient = new Translate({ ...this.credentials })
  }
  async detectLanguage(text) {
    const detectedLangResp = await this.googleTranslateClient
      .detect(text)
      .catch(err => console.error(JSON.stringify(err, null, 2)))
    console.log(`detectedLang: ${JSON.stringify(detectedLangResp, null, 2)}`)
    return detectedLangResp[0].language
  }
}
