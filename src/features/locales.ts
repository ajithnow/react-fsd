import { generateResources } from '@/shared/utils/common.utils';
import authLocales from './auth/locales';
import dashboardLocales from './dashboard/locales';
import customersLocales from './customers/locales';
import moduleConfig from './configs';

const modules = {
  auth: authLocales,
  dashboard: dashboardLocales,
  customers: customersLocales,
};

const { supportedLanguages, features } = moduleConfig;

const localesConfig = generateResources({
  supportedLanguages,
  features,
  modules,
});

export default localesConfig;
