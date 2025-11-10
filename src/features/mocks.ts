import authHandlers from './auth/mocks';
import { settingsHandlers } from './settings/mocks/settings.handlers';
import { usersHandlers } from './users/mocks';

const mocks = [
  ...authHandlers,
  ...settingsHandlers,
  ...usersHandlers
];

export default mocks;
