import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { ENV } from "../utils/env.utils";
import { localeRegistry } from "@/core/registry";
import type { Resource } from "i18next";

// Aggregate all registered locales into i18next resources
const registeredLocales = localeRegistry.getAll();
const resources: Resource = {};
const namespaces: string[] = [];

registeredLocales.forEach((cfg) => {
  namespaces.push(cfg.ns);
  Object.entries(cfg.resources).forEach(([lng, res]) => {
    if (!resources[lng]) resources[lng] = {};
    // Safe cast to satisfy i18next Resource shape
    (resources[lng] as Record<string, unknown>)[cfg.ns] = res;
  });
});

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
    ns: namespaces,
    defaultNS: "common",
    react: {
      useSuspense: true,
    },
  });

// Freeze the locale registry once initialization is done
localeRegistry.freeze();

export default i18n;
