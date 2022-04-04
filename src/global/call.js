import * as api from './api.js';

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

export { showAllLevels, showAllDoors, showAllCards, addNewDoor, editDoor, deleteDoor };