import { generateResources } from "@/shared/utils/common.utils";
import authLocales from "./auth/locales";
import moduleConfig from "./configs";

const modules = {
  auth: authLocales,
};

const { supportedLanguages, features } = moduleConfig;

const localesConfig = generateResources({
  supportedLanguages,
  features,
  modules,
});

export default localesConfig;
