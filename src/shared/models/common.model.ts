export interface GenerateResourcesOptions {
  modules: Record<string, LocaleStructure>;
  supportedLanguages: string[];
  features: string[];
}

export type LocaleStructure = {
  [key: string]: Record<string, Record<string, string>>;
};
