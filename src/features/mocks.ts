import authHandlers from "./auth/mocks";
import { usersHandler } from './home/mocks/users.mock';

const mocks = [...authHandlers, ...usersHandler];

export default mocks;
