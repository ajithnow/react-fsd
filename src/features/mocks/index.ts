import authHandlers from '../auth/mocks';
import { settingsHandlers } from '../settings/mocks/settings.handlers';
import { usersHandlers } from '../users/mocks';

const handlers = [
  ...authHandlers,
  ...settingsHandlers,
  ...usersHandlers,
];

export default handlers;
