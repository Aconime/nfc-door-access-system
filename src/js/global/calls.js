import * as api from './api.js';

// User Token
const token = { headers: { 'x-authorization-token': localStorage.getItem('userToken') }};

async function showAllLevels() {
  let results;

  await fetch(api.allLevels, token)
    .then(res => {
      if (res.ok) return res.json();
      else throw new Error(res.status);
    })
    .then(levels => {
      if (levels.payload) results = levels.payload;
    })
    .catch(() => location.href = "./login.html");

  return results;
}

async function addNewDoor(doorName, levelId, doorStatus=1) {
  let results;

  let doorData = "door_identifier=" + doorName + "&door_access_level_id=" + levelId + "&is_active=" + doorStatus;

  await fetch(api.addDoor + "?" + doorData, token)
    .then(res => {
      if (res.ok) return res.json();
      else throw new Error(res.status);
    })
    .then(doorRes => results = doorRes)
    .catch(() => location.href = "./login.html");

  return results;
}

async function showAllDoors() {
  let results;

  await fetch(api.allDoors, token)
    .then(res => {
      if (res.ok) return res.json();
      else throw new Error(res.status);
    })
    .then(doors => {
      if (doors.payload) results = doors.payload;
    })
    .catch((err) => location.href = "./login.html");

  return results;
}

export { showAllLevels, addNewDoor, showAllDoors };