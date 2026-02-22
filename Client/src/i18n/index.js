import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import hi from './hi.json'
import mr from './mr.json'
import ta from './ta.json'
import te from './te.json'
import kn from './kn.json'
import bn from './bn.json'
import gu from './gu.json'
import pa from './pa.json'
import ml from './ml.json'
import or_lang from './or.json'
import as_lang from './as.json'
import ur from './ur.json'
import ks from './ks.json'
import mai from './mai.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
      ta: { translation: ta },
      te: { translation: te },
      kn: { translation: kn },
      bn: { translation: bn },
      gu: { translation: gu },
      pa: { translation: pa },
      ml: { translation: ml },
      or: { translation: or_lang },
      as: { translation: as_lang },
      ur: { translation: ur },
      ks: { translation: ks },
      mai: { translation: mai },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export default i18n
