import * as host from './host.js';

const login = `${host.apiHost}/login`;
const allLevels = `${host.apiHost}/api/levels/all`;
const allDoors = `${host.apiHost}/api/doors/all`;
const allCards = `${host.apiHost}/api/cards/all`;
const addDoor = `${host.apiHost}/api/doors/add`;

export { login, allLevels, allDoors, allCards, addDoor };