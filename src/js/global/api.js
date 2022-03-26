import * as host from './host.js';

const getLevelsAll  = `${host.apiHost}/api/levels/all`;
const getDoorsAll   = `${host.apiHost}/api/doors/all`;
const getCardsAll   = `${host.apiHost}/api/cards/all`;
const login         = `${host.apiHost}/login`;

export { getLevelsAll, getDoorsAll, getCardsAll, login };