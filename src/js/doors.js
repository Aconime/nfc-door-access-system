import * as api from './global/api.js';

// User Token
const token = localStorage.getItem('userToken');

// LOAD ALL LEVELS ON MODAL DROPDOWN
const addDoorModal = document.getElementById("add-door-modal");
if (addDoorModal) $("#add-door-modal").modal({
  onShow: () => {
    const doorLevelDropDown = document.getElementById("door-level-select");
    doorLevelDropDown.innerHTML = "<option value=''>Select Level</option>";

    fetch(api.getLevelsAll, { headers: { 'x-authorization-token': token }})
      .then(res => {
        if (res.ok) return res.json();
        else throw new Error(res.status);
      })
      .then(levels => {
        console.log(levels);
        if (levels.payload)
          for (let i = 0; i <= levels.payload.length - 1; i++)
            doorLevelDropDown.innerHTML += `<option value="${levels.payload[i].level_id}">${levels.payload[i].level}</option>`;
      })
      .catch(err => console.log(err));
  },
}).modal('attach events', '#open-new-door-modal', 'show');

// MODAL ADD NEW DOOR BUTTON
const addDoorButton = document.getElementById("add-door-btn");
if (addDoorButton) addDoorButton.addEventListener("click", () => {
  const doorTag = document.getElementById("door-tag-input").value;
  const doorNumber = document.getElementById("door-number-input").value;
  const doorIdentifier = doorTag + ":" + doorNumber;
  const doorLevel = document.getElementById("door-level-select");

  const doorData = {
    "door_identifier": doorIdentifier,
    "door_access_level_id": doorLevel,
    "is_active": 1
  };

  fetch('host/api/doors/add', {
    method: 'POST',
    body: JSON.stringify(doorData),
  })
  .then(response => response.json())
  .then(doorResponse => {
    console.log('Success:', doorResponse);
  })
  .catch((error) => {
    console.error('Error:', doorResponse);
  });
});