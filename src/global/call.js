import * as api from './api.js';
import * as modals from './modals.js';

// User Token
const token = { 'x-authorization-token': localStorage.getItem('userToken') }

async function showAllLevels() {
  let results;

  await fetch(api.allLevels, { headers: token })
    .then(res => res.json())
    .then(levels => {
      if (levels.payload) results = levels.payload;
    });

  return results;
}

async function showAllDoors() {
  let results;

  await fetch(api.allDoors, { headers: token })
    .then(res => res.json())
    .then(doors => {
      if (doors.payload) results = doors.payload;
    });

  return results;
}

async function showAllCards() {
  let results;

  await fetch(api.allCards, { headers: token })
    .then(res => res.json())
    .then(cards => {
      if (cards.payload) results = cards.payload;
    });

  return results;
}

async function showAllClients() {
  let results;

  await fetch(api.allClients, { headers: token })
    .then(res => res.json())
    .then(clients => {
      if (clients.payload) results = clients.payload;
    });

  return results;
}

async function getAllClients(userId) {
  let results;

  await fetch(api.getClients + "?user_id=" + userId, { headers: token })
    .then(res => res.json())
    .then(clients => {
      if (clients.payload) results = clients.payload;
    });

  return results;
}

async function addNewDoor(doorName, levelId, doorStatus=1) {
  let results;

  let doorData = "door_identifier=" + doorName + "&door_access_level_id=" + levelId + "&is_active=" + doorStatus;

  await fetch(api.addDoor + "?" + doorData, { headers: token })
    .then(res => res.json())
    .then(doorRes => results = doorRes);

  return results;
}

async function editDoor(doorId, doorName, levelId, doorStatus) {
  let results;
  
  let doorData = "door_id=" + doorId + "&door_identifier=" + doorName + "&door_access_level_id=" + levelId + "&is_active=" + doorStatus;

  await fetch(api.editDoor + "?" + doorData, { headers: token })
    .then(res => res.json())
    .then(doorRes => results = doorRes);

  return results;
}

async function deleteDoor(doorId) {
  let results;
  
  await fetch(api.delDoor + "?door_id=" + doorId, { headers: token })
    .then(res => res.json())
    .then(doorRes => results = doorRes);

  return results;
}

async function addNewLevel(levelName) {
  let results;

  await fetch(api.addLevel + "?level=" + levelName, { headers: token })
    .then(res => res.json())
    .then(levelRes => results = levelRes);

  return results;
}

async function deleteLevel(levelId) {
  let results;

  await fetch(api.delLevel + "?level_id=" + levelId, { headers: token })
    .then(res => res.json())
    .then(levelRes => results = levelRes)
    .catch(err => {
      results = err;
      modals.showInnerModal("Cannot Delete Level", "This level is being used by one or more doors, please edit the doors before removing a level.");
    });

  
  return results;
}

async function addNewClientWithDoors(fname, lname, email, card, doors, status, hasExp=false, expDate=null) {
  let results;
  
  let registrationData = "";
  if (hasExp)
    registrationData = `first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&doors=${doors}&is_active=${status}&expires_at=${expDate}`;
  else
    registrationData = `first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&doors=${doors}&is_active=${status}`;

  await fetch(api.addClient + "?" + registrationData, { headers: token })
    .then(res => res.json())
    .then(clientRes => results = clientRes);

  return results;
}

async function addNewClientWithLevels(fname, lname, email, card, levels, status, hasExp=false, expDate=null) {
  let results;

  let registrationData = "";
  if (hasExp)
    registrationData = `first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&levels=${levels}&is_active=${status}&expires_at=${expDate}`;
  else
    registrationData = `first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&levels=${levels}&is_active=${status}`;

  await fetch(api.addClient + "?" + registrationData, { headers: token })
    .then(res => res.json())
    .then(clientRes => results = clientRes);

  return results;
}

async function addNewClientWithBoth(fname, lname, email, card, doors, levels, status, hasExp=false, expDate=null) {
  let results;
  
  let registrationData = "";
  if (hasExp)
    registrationData = `first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&doors=${doors}&levels=${levels}&is_active=${status}&expires_at=${expDate}`;
  else
    registrationData = `first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&doors=${doors}&levels=${levels}&is_active=${status}`;

  await fetch(api.addClient + "?" + registrationData, { headers: token })
    .then(res => res.json())
    .then(clientRes => results = clientRes);

  return results;
}

async function addNewAdminClient(fname, lname, email, card, status, hasExp=false, expDate=null) {
  let results;
  
  let registrationData = `first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Administrator&cards=${card}&is_active=${status}`;
  
  await fetch(api.addClient + "?" + registrationData, { headers: token })
    .then(res => res.json())
    .then(clientRes => results = clientRes);

  return results;
}

async function checkEmailAddress(email) {
  let result;

  await fetch(api.checkEmail + "?email=" + email, { header: token })
    .then(res => res.json())
    .then(userId => result = userId);

  return result;
}

async function editCardClientDoors(userId, fname, lname, email, card, status, doors, hasExp=false, expDate=null) {
  let result;

  let clientData = "";
  if (hasExp) 
    clientData = `user_id=${userId}&first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&doors=${doors}&is_active=${status}&expires_at=${expDate}`;
  else
    clientData = `user_id=${userId}&first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&doors=${doors}&is_active=${status}`;

  await fetch(api.editClient + "?" + clientData, { header: token })
    .then(res => res.json())
    .then(clientRes => result = clientRes);

  return result;
}

async function editCardClientLevels(userId, fname, lname, email, card, status, levels, hasExp=false, expDate=null) {
  let result;

  let clientData = "";
  if (hasExp) 
    clientData = `user_id=${userId}&first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&levels=${levels}&is_active=${status}&expires_at=${expDate}`;
  else
    clientData = `user_id=${userId}&first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&levels=${levels}&is_active=${status}`;

  await fetch(api.editClient + "?" + clientData, { header: token })
    .then(res => res.json())
    .then(clientRes => result = clientRes);

  return result;
}

async function editCardClientBoth(userId, fname, lname, email, card, status, doors, levels, hasExp=false, expDate=null) {
  let result;

  let clientData = "";
  if (hasExp) 
    clientData = `user_id=${userId}&first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&doors=${doors}&levels=${levels}&is_active=${status}&expires_at=${expDate}`;
  else
    clientData = `user_id=${userId}&first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Standard&cards=${card}&doors=${doors}&levels=${levels}&is_active=${status}`;

  await fetch(api.editClient + "?" + clientData, { header: token })
    .then(res => res.json())
    .then(clientRes => result = clientRes);

  return result;
}


async function editCardClientAsAdmin(userId, fname, lname, email, card, status=1) {
  let result;

  let clientData = `user_id=${userId}&first_name=${fname}&last_name=${lname}&email=${email}&type_of_access=Administrator&cards=${card}&is_active=${status}`;

  await fetch(api.editClient + "?" + clientData, { header: token })
    .then(res => res.json())
    .then(clientRes => result = clientRes);

  return result;
}

async function clientUpdateStatus(userId, status) {
  let result;

  let clientData = `user_id=${userId}&is_active=${status}`;

  await fetch(api.editClientStatus + "?" + clientData, { header: token })
    .then(res => res)
    .then(clientRes => result = clientRes);

  return result;
}

export { 
  showAllLevels,
  showAllDoors,
  showAllCards,
  showAllClients,
  getAllClients,
  addNewDoor,
  editDoor,
  deleteDoor,
  addNewLevel,
  deleteLevel,
  addNewClientWithDoors,
  addNewClientWithLevels,
  addNewClientWithBoth,
  addNewAdminClient,
  checkEmailAddress,
  editCardClientBoth,
  editCardClientDoors,
  editCardClientLevels,
  editCardClientAsAdmin,
  clientUpdateStatus
};