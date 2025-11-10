import { generateResources } from '@/shared/utils/common.utils';
import sharedLocales from '@/shared/locales';
import authLocales from './auth/locales';
import dashboardLocales from './dashboard/locales';
import userLocales from './users/locales';
import settingsLocales from './settings/locales/index';
import moduleConfig from './configs';

const modules = {
  auth: authLocales,
  dashboard: dashboardLocales,
  users: userLocales,
  shared: sharedLocales,
  settings: settingsLocales,
};

const { supportedLanguages, features } = moduleConfig;

const localesConfig = generateResources({
  supportedLanguages,
  features,
  modules,
});

export default localesConfig;
