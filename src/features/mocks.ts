import authHandlers from './auth/mocks';
import { customersHandlers } from './customers/mocks';

const mocks = [...authHandlers, ...customersHandlers];

export default mocks;
