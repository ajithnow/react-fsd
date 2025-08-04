import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { ENV } from "../utils/env.utils";

import locales from "@/features/locales";

const { features, resources } = locales;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: ENV.IS_DEV,
    interpolation: {
      escapeValue: false,
    },
    ns: features,
    defaultNS: "common",
    react: {
      useSuspense: true,
    },
  });

export default i18n;
