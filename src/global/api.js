import * as host from './host.js';

const login = `${host.apiHost}/login`;
const allLevels = `${host.apiHost}/api/levels/all`;
const allDoors = `${host.apiHost}/api/doors/all`;
const allCards = `${host.apiHost}/api/cards/all`;
const allClients = `${host.apiHost}/api/users/all`;
const getClients = `${host.apiHost}/api/users/get`;
const addDoor = `${host.apiHost}/api/doors/add`;
const editDoor = `${host.apiHost}/api/doors/edit`;
const delDoor = `${host.apiHost}/api/doors/delete`;
const addLevel = `${host.apiHost}/api/levels/add`;
const delLevel = `${host.apiHost}/api/levels/delete`;

export { login, allLevels, allDoors, allCards, allClients, getClients, addDoor, editDoor, delDoor, addLevel, delLevel };