import type { GenerateResourcesOptions } from "../models/common.model";

/**
 * This function is used to generate localization resources for the application.
 * @param modules
 * @param supportedLanguages
 * @param features
 * @returns resources, supportedLanguages, features
 *
 */
export const generateResources = ({
  modules,
  supportedLanguages,
  features,
}: GenerateResourcesOptions) => {
  const resources: Record<string, Record<string, Record<string, string>>> = {};

  for (const lang of supportedLanguages) {
    resources[lang] = {};

    for (const [feature, locales] of Object.entries(modules)) {
      resources[lang][feature] =
        (locales as unknown as Record<string, Record<string, string>>)[lang] ||
        {};
    }
  }

  return {
    resources,
    supportedLanguages,
    features,
  };
};
