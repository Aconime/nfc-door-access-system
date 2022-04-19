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
    
    if (allDoors[i].is_active == 0) doorListItem += `<td data-label="doorstat">Unavailable</td>`;
    else if (allDoors[i].is_active == 1) doorListItem += `<td data-label="doorstat">Available</td>`;
        
    doorListItem += `<td data-label="action">
          <button id="dr-ed-btn-${i}" class="ui tiny basic button edit-door-btn"><i class="edit icon"></i> Edit</button>
        </td>
      </tr>`;

    allDoorsTableContent.innerHTML += doorListItem;
  }

  let refreshResult = []
  const editButtons = document.getElementsByClassName('edit-door-btn');
  for (let i = 0; i <= editButtons.length -1; i++) {
    let doorId = editButtons[i].parentNode.parentNode.getAttribute('data-door-id');
    refreshResult.push({
      "door_id": doorId,
      "button_id": editButtons[i].id.toString()
    });
  }

  return refreshResult;
}

async function refreshAllLevelsList() {
  const allLevelsTableContent = document.getElementById("all-levels-table-content");
  allLevelsTableContent.innerHTML = "";

  let allLevels = await call.showAllLevels();

  for (let i = 0; i <= allLevels.length - 1; i++)
    allLevelsTableContent.innerHTML += `<tr data-level-id="${allLevels[i].level_id}">
        <td data-label="lvl">${allLevels[i].level}</td>
        <td class="right aligned" data-label="action">
          <button id="lvl-del-btn-${i}" class="ui tiny basic button lvl-del-btn"><i class="trash icon"></i> Remove</button>
        </td>
      </tr>`;

  let refreshResult = []
  const deleteLevelButtons = document.getElementsByClassName('lvl-del-btn');
  for (let i = 0; i <= deleteLevelButtons.length -1; i++) {
    let levelId = deleteLevelButtons[i].parentNode.parentNode.getAttribute('data-level-id');
    refreshResult.push({
      "level_id": levelId,
      "button_id": deleteLevelButtons[i].id.toString()
    });
  }

  return refreshResult;
}

async function refreshAllCardsList() {
  const allCardsTableContent = document.getElementById("all-cards-table-content");
  allCardsTableContent.innerHTML = "";

  let allCards = await call.showAllCards();

  for (let i = 0; i <= allCards.length - 1; i++) {
    let cardListItem = `<tr id="${allCards[i].card_id}">
      <td data-label="uid">${allCards[i].uid.toUpperCase()}</td>`;

    if (allCards[i].is_active == 0) 
      cardListItem += `<td data-label="cardstat">Available</td>`
    else if (allCards[i].is_active == 1) 
      cardListItem += `<td data-label="cardstat">Occupied</td>`;
    else if (allCards[i].is_active == 2) 
      cardListItem += `<td data-label="cardstat">Broken</td>`;
    
    cardListItem += `<td data-label="action">
          <button class="ui tiny basic button" data-btn-info="cards-action"><i class="edit icon"></i> Edit</button>
        </td>
      </tr>`;

    allCardsTableContent.innerHTML += cardListItem;
  }
}

async function refreshAllClients() {
  const allClientsTableContent = document.getElementById("all-clients-table-content");
  allClientsTableContent.innerHTML = "";

  let allClients = await call.showAllClients();
  for (let i = 0; i <= allClients.length - 1; i++) {
    let allCardCliets = await call.getAllClients(allClients[i].user_id);
    if (allCardCliets.cards[0]) {
      let clientsListItem;

      clientsListItem = `<tr id="${allClients[i].user_id}">
        <td data-label="cname">${allCardCliets.first_name + " " + allCardCliets.last_name}</td>
        <td data-label="cemail">${allCardCliets.email}</td>
        <td data-label="cuid">${allCardCliets.cards[0].uid.toUpperCase()}</td>`;

      let clientDoorsAndLevels = "";

      for (let j = 0; j <= allCardCliets.cards[0].levels.length - 1; j++) {
        let levels = allCardCliets.cards[0].levels[j].level;
        clientDoorsAndLevels += levels + ", ";
      }

      for (let j = 0; j <= allCardCliets.cards[0].doors.length - 1; j++) {
        let doorTag = allCardCliets.cards[0].doors[j].door_identifier.split(":")[1];
        clientDoorsAndLevels += doorTag + ", ";
      }

      clientDoorsAndLevels = clientDoorsAndLevels.slice(0, -2);
      
      clientsListItem += `<td data-label="cdoor">${clientDoorsAndLevels}</td>`;
      
      if (allCardCliets.cards[0].expires_at == null || allCardCliets.cards[0].expires_at.length == 0) 
        clientsListItem += `<td data-label="cexp">No Expiration</td>`;
      else {
        clientsListItem += `<td data-label="cexp">${allCardCliets.cards[0].expires_at}</td>`;
        
        if (new Date(allCardCliets.cards[0].expires_at).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0))
          await call.clientUpdateStatus(allClients[i].user_id, 2);
      }

      if (allCardCliets.is_active == 0) {
        clientsListItem += `<td data-label="cstat">
            <div id="status-toggle-${allClients[i].user_id}" class="ui fluid label status-element">
              <div class="ui empty circular grey label" style="margin-top: 2px; float: left;"></div>
              <p style="text-align: center;">Inactive</p>
            </div>
          </td>`;
      } else if (allCardCliets.is_active == 1) {
        clientsListItem += `<td data-label="cstat">
            <div id="status-toggle-${allClients[i].user_id}" class="ui fluid label status-element">
              <div class="ui empty circular green label" style="margin-top: 2px; float: left;"></div>
              <p style="text-align: center;">Active</p>
            </div>
          </td>`;
      } else if (allCardCliets.is_active == 2) {
        clientsListItem += `<td data-label="cstat">
            <div id="status-toggle-${allClients[i].user_id}" class="ui fluid label status-element">
              <div class="ui empty circular red label" style="margin-top: 2px; float: left;"></div>
              <p style="text-align: center;">Expired</p>
            </div>
          </td>`;
      }

      clientsListItem += `<td data-label="action">
            <button class="ui tiny basic button edit-client-btn"><i class="edit icon"></i> Edit</button>
          </td>
        </tr>`;

      allClientsTableContent.innerHTML += clientsListItem;
    }
  }

  const statusElements = document.querySelectorAll(".status-element");
  for (let i = 0; i <= statusElements.length - 1; i++) {
    statusElements[i].addEventListener("click", () => {
      let getUserId = statusElements[i].id.toString().split("-")[2];
      statusChangeMethod(getUserId);
    });
  }
}

async function statusChangeMethod(userId) {
  let getClientStatus = await call.getAllClients(userId);
  if (getClientStatus.is_active == 0) {
    await call.clientUpdateStatus(userId, 1);
    refreshAllClients();
  } else if (getClientStatus.is_active == 1) {
    await call.clientUpdateStatus(userId, 0);
    refreshAllClients();
  }
}

async function refreshAllLogs() {
  const allLogsTableContent = document.getElementById("all-logs-table-content");
  allLogsTableContent.innerHTML = "";

  let logs = await call.showAllLogs();
  
  for (let i = 0; i <= logs.length - 1; i++) {
    let doorListItem;

    let logDate = logs[i].logged_at.split(" ")[0];
    let logTime = logs[i].logged_at.split(" ")[1];

    doorListItem = `<tr id="${logs[i].log_id}">
        <td data-label="log-date">${logDate}</td>
        <td data-label="log-time">${logTime}</td>
        <td data-label="log-cat">${logs[i].log_category.charAt(0).toUpperCase() + logs[i].log_category.slice(1)}</td>
        <td data-label="log-msg">${logs[i].message}</td>`;

    if (logs[i].severity <= 2) 
      doorListItem += `<td data-label="log-severity">Low</td>`;
    else if (logs[i].severity > 2 && logs[i].severity <= 4) 
      doorListItem += `<td data-label="log-severity">Medium</td>`;
    else if (logs[i].severity == 5) 
      doorListItem += `<td data-label="log-severity">High</td>`;

    if (logs[i].has_investigated == 0)
      doorListItem += `<td data-label="log-reviewed"><button id="log-btn-${logs[i].log_id}" class="ui button basic fluid investigate-btn">Pending Review</button></td></tr>`;
    else {
      let adminUserId = logs[i].has_investigated;
      let getAdminDetails = await call.getAllClients(adminUserId);
      doorListItem += `<td data-label="log-reviewed">Reviewed By <b>${getAdminDetails.first_name} ${getAdminDetails.last_name}</b></td></tr>`;
    }
    
    allLogsTableContent.innerHTML += doorListItem;
  }

  const investigateButtons = document.querySelectorAll(".investigate-btn");
  for (let i = 0; i <= investigateButtons.length - 1; i++) {
    if (investigateButtons[i]) investigateButtons[i].addEventListener("click", async () => {
      let logId = investigateButtons[i].id.toString().split("-")[2];
      let investigateResult = await call.investigateLog(logId, localStorage.getItem("userId"));
      if (investigateResult.success == "true") {
        refreshAllLogs();
      }
    });
  }
}

export { refreshAllDoorsList, refreshAllLevelsList, refreshAllCardsList, refreshAllClients, refreshAllLogs };