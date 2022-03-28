import * as call from './call.js';

async function refreshAllDoorsList() {
  const allDoorsTableContent = document.getElementById("all-doors-table-content");
  allDoorsTableContent.innerHTML = "";

  let allDoors = await call.showAllDoors();
  
  for (let i = 0; i <= allDoors.length - 1; i++) {
    let doorListItem;

    let doorTag = allDoors[i].door_identifier.split(":")[0];
    let doorNumber = allDoors[i].door_identifier.split(":")[1];

    doorListItem = `<tr data-door-id="${allDoors[i].door_id}">
      <td data-label="tag">${doorTag}</td>
      <td data-label="door">${doorNumber}</td>`;

    let allLevels = await call.showAllLevels();
    let levelFound = false;
    for (let j = 0; j <= allLevels.length - 1; j++) {
      if (allLevels[j].level_id == allDoors[i].door_access_level_id) {
        levelFound = true;
        doorListItem += `<td data-label="door-lvl">${allLevels[j].level}</td>`;
        break;
      } else levelFound = false;
    }

    if (!levelFound) doorListItem += `<td data-label="door-lvl">-</td>`;

    
    if (allDoors[i].is_active == 0) doorListItem += `<td data-label="doorstat">Broken</td>`;
    else if (allDoors[i].is_active == 1) doorListItem += `<td data-label="doorstat">Available</td>`;
    else if (allDoors[i].is_active == 2) doorListItem += `<td data-label="doorstat">Unavailable</td>`;
        
    doorListItem += `<td data-label="action">
          <button class="ui tiny basic button"><i class="edit icon"></i> Edit</button>
        </td>
      </tr>`;

    allDoorsTableContent.innerHTML += doorListItem;
  }
}

export { refreshAllDoorsList };