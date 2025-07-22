import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import authEn from '../../features/auth/locales/en.json'; 

const resources = {
  en: {
    auth: authEn,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    ns: ['common', 'auth', 'dashboard'],
    defaultNS: 'common',
    react: {
      useSuspense: true,
    },
  });

export default i18n;