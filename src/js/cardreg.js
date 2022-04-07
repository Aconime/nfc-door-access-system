import * as call from '../global/call.js';
import * as modals from '../global/modals.js';

// DATE TIME FORMAT FUNCTION
function getDateFormat(formatType, formatDate=null) {
  let displayTime;

  if (formatType == 0) {
    let today = new Date(formatDate);
    let y = today.getFullYear();
    let m = today.getMonth()+1;
    let d = today.getDate();
    let h = today.getHours();
    let min = today.getMinutes();

    if(m.toString().length == 1) m = '0' + m;
    if(d.toString().length == 1) d = '0' + d;
    if(h.toString().length == 1) h = '0' + h;
    if(min.toString().length == 1) min = '0' + min;
    
    displayTime = `${y}-${m}-${d}T${h}:${min}`;
  } else if (formatType == 1){
    let date = new Date(formatDate);
    let y = date.getFullYear();
    let m = date.getMonth()+1;
    let d = date.getDate();
    let h = date.getHours();
    let min = date.getMinutes();
    let s = date.getSeconds();

    if(m.toString().length == 1) m = '0' + m;
    if(d.toString().length == 1) d = '0' + d;
    if(h.toString().length == 1) h = '0' + h;
    if(min.toString().length == 1) min = '0' + min;
    if(s.toString().length == 1) s = '0' + s;
    
    displayTime = `${y}-${m}-${d} ${h}:${min}:${s}`;
  }

  return displayTime;
}

// CONST ALL INPUTS AND ELEMNTS THAT WILL HOLD INFO REGARDING THE SUBMITION
const firstNameInput = document.getElementById("fname");
const lastNameInput = document.getElementById("lname");
const emailInput = document.getElementById("email");
const standardAccessRadio = document.getElementById("standrad");
const adminAccessRadio = document.getElementById("adminrad");
const expirationDateInput = document.getElementById("expdate");
const expirationDateCheck = document.getElementById("expdatecheck");

// DROPDOWNS VIA STANDARD DEFINITION (NOT JQUERY VIA SEMANTIC-UI)
const cardDropDown = document.getElementById("card-selection");
const doorsDropDown = document.getElementById("door-selection");
const levelsDropDown = document.getElementById("level-selection");

// BUTTON(S)
const activatePendingClientButton = document.getElementById("pedning-card-btn");

// OTHER
const tabContentTitle = document.getElementById("user-reg-title-heading");

async function reloadTabContent() {
  activateCardToClientButton.classList.remove("edit-client-mode-btn");
  activateCardToClientButton.innerHTML = `<i class="fas fa-check"></i> Activate Card`;
  activatePendingClientButton.classList.remove("hide-element");

  tabContentTitle.innerText = "CLIENT REGISTRATION";

  // Clear all dropdowns
  $("#card-selection").dropdown('clear');
  $("#door-selection").dropdown('clear');
  $("#level-selection").dropdown('clear');
  cardDropDown.parentElement.style.outline = "none"
  doorsDropDown.parentElement.style.outline = "none"
  levelsDropDown.parentElement.style.outline = "none"

  firstNameInput.value = "";
  firstNameInput.style.outline = "none";

  lastNameInput.value = "";
  lastNameInput.style.outline = "none";

  emailInput.value = "";
  emailInput.style.outline = "none";

  expirationDateInput.value = "";
  expirationDateInput.style.outline = "none";

  expirationDateCheck.checked = false;
  expirationDateInput.classList.remove("hide-element");
  
  // Allow dates to be picked from today an on
  expirationDateInput.min = getDateFormat(0);

  // Load all cards to the card dropdown
  cardDropDown.innerHTML = `<option value="">Select Card UID</option>`;

  let allCards = await call.showAllCards();

  for (let i = 0; i <= allCards.length - 1; i++)
    if (allCards[i].is_active == 0)
      cardDropDown.innerHTML += `<option value="${allCards[i].card_id}">${allCards[i].uid}</option>`;
  
  // Load all doors to the doors dropdown
  doorsDropDown.innerHTML = "";

  let allDoors = await call.showAllDoors();

  for (let i = 0; i <= allDoors.length - 1; i++)
    if (allDoors[i].is_active == 1) 
      doorsDropDown.innerHTML += `<option value="${allDoors[i].door_id}">${allDoors[i].door_identifier.split(":")[1]}</option>`;

  // Load all levels to the levels dropdown
  levelsDropDown.innerHTML = "";

  let allLevels = await call.showAllLevels();

  for (let i = 0; i <= allLevels.length - 1; i++)
    levelsDropDown.innerHTML += `<option value="${allLevels[i].level_id}">${allLevels[i].level}</option>`;
}

const registerClientsTabButton = document.getElementById("register-client-tab-btn");
if (registerClientsTabButton) registerClientsTabButton.addEventListener("click", () => { reloadTabContent(); });


function cardAccessLevel(access) {
  const cardAccessLevelContent = document.getElementById("togglable-visible-content");
  const cardAccessWarning = document.getElementById("card-access-warning");
  if (access == 1) {
    cardAccessLevelContent.classList.add("card-access-hide");
    cardAccessWarning.classList.remove("card-access-hide");
  }
  else if (access == 0) {
    cardAccessLevelContent.classList.remove("card-access-hide");
    cardAccessWarning.classList.add("card-access-hide");
  }
}

if (adminAccessRadio) adminAccessRadio.addEventListener("change", () => { cardAccessLevel(1) });
if (standardAccessRadio) standardAccessRadio.addEventListener("change", () => { cardAccessLevel(0) });

if (expirationDateCheck) expirationDateCheck.addEventListener("change", () => {
  if (expirationDateCheck.checked)
    expirationDateInput.classList.add("hide-element");
  else 
    expirationDateInput.classList.remove("hide-element");
});

const activateCardToClientButton = document.getElementById("activate-card-btn");
if (activateCardToClientButton) activateCardToClientButton.addEventListener("click", async () => {
  if (activateCardToClientButton.classList.contains("edit-client-mode-btn"))
    await editCardAndClient();
  else
    await activateCardAndAddClient(1);
});

async function activateCardAndAddClient(regStatus) {
  let firstName = firstNameInput.value;
  let lastName = lastNameInput.value;
  let email = emailInput.value;
  let cardId = $("#card-selection").dropdown("get value");
  let doors = $("#door-selection").dropdown("get value");
  let levels = $("#level-selection").dropdown("get value");
  let expDate = expirationDateInput.value;
  let noExpDate = expirationDateCheck.checked;

  if (firstName.length > 0 && lastName.length > 0 && email.length > 0 && cardId.length > 0) {
    if (standardAccessRadio.checked) {
      if (doors.length > 0 || levels.length > 0) {
        if (!noExpDate && expDate.length > 0) {
          if (doors.length > 0 && levels.length == 0) {
            let apiReadyDoors = "";
            for (let i = 0; i <= doors.length - 2; i++) apiReadyDoors += doors[i] + ",";
            apiReadyDoors += doors[doors.length -1];

            let addClientResult = await call.addNewClientWithDoors(firstName, lastName, email, cardId, apiReadyDoors, regStatus, true, getDateFormat(1, expDate));
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been added and a card has been registered successfuly.");
            }
          } else if (levels.length > 0 && doors.length == 0) {
            let apiReadyLevels = "";
            for (let i = 0; i <= levels - 2; i++) apiReadyLevels += levels[i] + ",";
            apiReadyLevels += levels[levels.length -1];

            let addClientResult = await call.addNewClientWithLevels(firstName, lastName, email, cardId, apiReadyLevels, regStatus, true, getDateFormat(1, expDate));
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been added and a card has been registered successfuly.");
            }
          } else if (levels.length > 0 && doors.length > 0) {
            let apiReadyDoors = "";
            for (let i = 0; i <= doors.length - 2; i++) apiReadyDoors += doors[i] + ",";
            apiReadyDoors += doors[doors.length -1];

            let apiReadyLevels = "";
            for (let i = 0; i <= levels - 2; i++) apiReadyLevels += levels[i] + ",";
            apiReadyLevels += levels[levels.length -1];

            let addClientResult = await call.addNewClientWithBoth(firstName, lastName, email, cardId, apiReadyDoors, apiReadyLevels, regStatus, true, getDateFormat(1, expDate));
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been added and a card has been registered successfuly.");
            }
          }
        } else if (!noExpDate && expDate.length == 0) {
          expirationDateInput.style.outline = "2px solid #e74c3c";
          expirationDateInput.addEventListener("input", () => expirationDateInput.style.outline = "none");
          // SHOW ERROR MESSAGE
          modals.showOuternModal("Empty Fields", "Please enter all the required information on the feilds. Empty fields are not allowed.");
        } else if (noExpDate) {
          if (doors.length > 0 && levels.length == 0) {
            let apiReadyDoors = "";
            for (let i = 0; i <= doors.length - 2; i++) apiReadyDoors += doors[i] + ",";
            apiReadyDoors += doors[doors.length -1];

            let addClientResult = await call.addNewClientWithDoors(firstName, lastName, email, cardId, apiReadyDoors, regStatus);
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been added and a card has been registered successfuly.");
            }
          } else if (levels.length > 0 && doors.length == 0) {
            let apiReadyLevels = "";
            for (let i = 0; i <= levels - 2; i++) apiReadyLevels += levels[i] + ",";
            apiReadyLevels += levels[levels.length -1];

            let addClientResult = await call.addNewClientWithLevels(firstName, lastName, email, cardId, apiReadyLevels, regStatus);
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been added and a card has been registered successfuly.");
            }
          } else if (levels.length > 0 && doors.length > 0) {
            let apiReadyDoors = "";
            for (let i = 0; i <= doors.length - 2; i++) apiReadyDoors += doors[i] + ",";
            apiReadyDoors += doors[doors.length -1];

            let apiReadyLevels = "";
            for (let i = 0; i <= levels - 2; i++) apiReadyLevels += levels[i] + ",";
            apiReadyLevels += levels[levels.length -1];

            let addClientResult = await call.addNewClientWithBoth(firstName, lastName, email, cardId, apiReadyDoors, apiReadyLevels, regStatus);
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been added and a card has been registered successfuly.");
            }
          }
        }
      } else {
        // SHOW ERROR MESSAGE
        modals.showOuternModal("Invalid Options", "As this is a standard access card you must select atleast one door or level for this card in order to complete the registration.");
      }
    }
    else if (adminAccessRadio.checked) {
      let addClientResult = await call.addNewAdminClient(firstName, lastName, email, cardId, regStatus);
      if (addClientResult.success == "true") {
        reloadTabContent();
        modals.showOuternModal("Success", "The client has been added and a card has been registered successfuly.");
      }
    }
  } else {
    if (firstName.length == 0) {
      firstNameInput.style.outline = "2px solid #e74c3c";
      firstNameInput.addEventListener("input", () => firstNameInput.style.outline = "none");
    }

    if (lastName.length == 0) {
      lastNameInput.style.outline = "2px solid #e74c3c";
      lastNameInput.addEventListener("input", () => lastNameInput.style.outline = "none");
    }

    if (email.length == 0) {
      emailInput.style.outline = "2px solid #e74c3c";
      emailInput.addEventListener("input", () => emailInput.style.outline = "none");
    }

    if (cardId.length == 0) {
      cardDropDown.parentElement.style.outline = "2px solid #e74c3c";
      cardDropDown.addEventListener("change", () => cardDropDown.parentElement.style.outline = "none");
    }

    if (standardAccessRadio.checked) {
      if (!noExpDate && expDate.length == 0) {
        expirationDateInput.style.outline = "2px solid #e74c3c";
        expirationDateInput.addEventListener("input", () => expirationDateInput.style.outline = "none");
      }

      if (doors.length == 0 && levels.length == 0) {
        doorsDropDown.parentElement.style.outline = "2px solid #e74c3c";
        doorsDropDown.addEventListener("change", () => doorsDropDown.parentElement.style.outline = "none");

        levelsDropDown.parentElement.style.outline = "2px solid #e74c3c";
        levelsDropDown.addEventListener("change", () => levelsDropDown.parentElement.style.outline = "none");
      }
    }

    // SHOW ERROR MESSAGE
    modals.showOuternModal("Empty Fields", "Please enter all the required information on the feilds. Empty fields are not allowed.");
  }
}

let userEditId = "";

emailInput.addEventListener("blur", async () => {
  userEditId = "";
  await checkEmailAddress(emailInput.value);
})

async function checkEmailAddress(email) {
  let emailAddressResult = await call.checkEmailAddress(email);
  if (emailAddressResult.user_id != 0) {
    userEditId = emailAddressResult.user_id;

    let userDetails = await call.getAllClients(emailAddressResult.user_id);

    firstNameInput.value = userDetails.first_name;
    lastNameInput.value = userDetails.last_name;
    emailInput.value = userDetails.email;
    console.log(userDetails.allow_global_level_access);

    if (userDetails.allow_global_level_access == 0) {
      cardAccessLevel(0);
      standardAccessRadio.checked = true;
    }
    else {
      cardAccessLevel(1);
      adminAccessRadio.value = true;
    }

    if (userDetails.cards[0].expires_at.length != 0) {
      expirationDateInput.value = getDateFormat(0, userDetails.cards[0].expires_at);
      expirationDateCheck.value = true;
    } else {
      expirationDateInput.value = "";
      expirationDateCheck.value = false;
    }

    cardDropDown.innerHTML += `<option value="${userDetails.cards[0].card_id}">${userDetails.cards[0].uid}</option>`;
    $("#card-selection").dropdown('set value', userDetails.cards[0].card_id);

    for (let i = 0; i <= userDetails.cards[0].doors.length - 1; i++)
      $("#door-selection").dropdown('set selected', userDetails.cards[0].doors[i].door_id);

    for (let i = 0; i <= userDetails.cards[0].levels.length - 1; i++)
      $("#level-selection").dropdown('set selected', userDetails.cards[0].levels[i].level_id);
   
    activateCardToClientButton.classList.add("edit-client-mode-btn");
    activateCardToClientButton.innerHTML = `<i class="fas fa-check"></i> Update User`;
    activatePendingClientButton.classList.add("hide-element");
    tabContentTitle.innerText = "CLIENT UPDATE";
  }
}

async function editCardAndClient() {
  let firstName = firstNameInput.value;
  let lastName = lastNameInput.value;
  let email = emailInput.value;
  let cardId = $("#card-selection").dropdown("get value");
  let doors = $("#door-selection").dropdown("get value");
  let levels = $("#level-selection").dropdown("get value");
  let expDate = expirationDateInput.value;
  let noExpDate = expirationDateCheck.checked;
  
  console.log( getDateFormat(1, expDate));

  if (firstName.length > 0 && lastName.length > 0 && email.length > 0 && cardId.length > 0) {
    if (standardAccessRadio.checked) {
      if (doors.length > 0 || levels.length > 0) {
        if (!noExpDate && expDate.length > 0) {
          if (doors.length > 0 && levels.length == 0) {
            let apiReadyDoors = "";
            for (let i = 0; i <= doors.length - 2; i++) apiReadyDoors += doors[i] + ",";
            apiReadyDoors += doors[doors.length -1];

            let addClientResult = await call.editCardClientDoors(userEditId, firstName, lastName, email, cardId, 1, apiReadyDoors, true, getDateFormat(1, expDate));
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been updated successfuly.");
            }
          } else if (levels.length > 0 && doors.length == 0) {
            let apiReadyLevels = "";
            for (let i = 0; i <= levels - 2; i++) apiReadyLevels += levels[i] + ",";
            apiReadyLevels += levels[levels.length -1];

            let addClientResult = await call.editCardClientLevels(userEditId, firstName, lastName, email, cardId, 1, apiReadyLevels, true, getDateFormat(1, expDate));
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been updated successfuly.");
            }
          } else if (levels.length > 0 && doors.length > 0) {
            let apiReadyDoors = "";
            for (let i = 0; i <= doors.length - 2; i++) apiReadyDoors += doors[i] + ",";
            apiReadyDoors += doors[doors.length -1];

            let apiReadyLevels = "";
            for (let i = 0; i <= levels - 2; i++) apiReadyLevels += levels[i] + ",";
            apiReadyLevels += levels[levels.length -1];

            let addClientResult = await call.editCardClientBoth(userEditId, firstName, lastName, email, cardId, 1, apiReadyDoors, apiReadyLevels, true, getDateFormat(1, expDate));
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been updated successfuly.");
            }
          }
        } else if (!noExpDate && expDate.length == 0) {
          expirationDateInput.style.outline = "2px solid #e74c3c";
          expirationDateInput.addEventListener("input", () => expirationDateInput.style.outline = "none");
          // SHOW ERROR MESSAGE
          modals.showOuternModal("Empty Fields", "Please enter all the required information on the feilds. Empty fields are not allowed.");
        } else if (noExpDate) {
          if (doors.length > 0 && levels.length == 0) {
            let apiReadyDoors = "";
            for (let i = 0; i <= doors.length - 2; i++) apiReadyDoors += doors[i] + ",";
            apiReadyDoors += doors[doors.length -1];

            let addClientResult = await call.editCardClientDoors(userEditId, firstName, lastName, email, cardId, 1, apiReadyDoors);
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been updated successfuly.");
            }
          } else if (levels.length > 0 && doors.length == 0) {
            let apiReadyLevels = "";
            for (let i = 0; i <= levels - 2; i++) apiReadyLevels += levels[i] + ",";
            apiReadyLevels += levels[levels.length -1];

            let addClientResult = await call.editCardClientLevels(userEditId, firstName, lastName, email, cardId, 1, apiReadyLevels);
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been updated successfuly.");
            }
          } else if (levels.length > 0 && doors.length > 0) {
            let apiReadyDoors = "";
            for (let i = 0; i <= doors.length - 2; i++) apiReadyDoors += doors[i] + ",";
            apiReadyDoors += doors[doors.length -1];

            let apiReadyLevels = "";
            for (let i = 0; i <= levels - 2; i++) apiReadyLevels += levels[i] + ",";
            apiReadyLevels += levels[levels.length -1];

            let addClientResult = await call.editCardClientBoth(userEditId, firstName, lastName, email, cardId, 1, apiReadyDoors, apiReadyLevels);
            if (addClientResult.success == "true") {
              reloadTabContent();
              modals.showOuternModal("Success", "The client has been updated successfuly.");
            }
          }
        }
      } else {
        // SHOW ERROR MESSAGE
        modals.showOuternModal("Invalid Options", "As this is a standard access card you must select atleast one door or level for this card in order to complete the registration.");
      }
    } else if (adminAccessRadio.checked) {
      let addClientResult = await call.editCardClientAsAdmin(userEditId, firstName, lastName, email, cardId);
      if (addClientResult.success == "true") {
        reloadTabContent();
        modals.showOuternModal("Success", "The client has been updated successfuly.");
      } else {
        console.log(addClientResult);
      }
    }
  } else {
    if (firstName.length == 0) {
      firstNameInput.style.outline = "2px solid #e74c3c";
      firstNameInput.addEventListener("input", () => firstNameInput.style.outline = "none");
    }

    if (lastName.length == 0) {
      lastNameInput.style.outline = "2px solid #e74c3c";
      lastNameInput.addEventListener("input", () => lastNameInput.style.outline = "none");
    }

    if (email.length == 0) {
      emailInput.style.outline = "2px solid #e74c3c";
      emailInput.addEventListener("input", () => emailInput.style.outline = "none");
    }

    if (cardId.length == 0) {
      cardDropDown.parentElement.style.outline = "2px solid #e74c3c";
      cardDropDown.addEventListener("change", () => cardDropDown.parentElement.style.outline = "none");
    }

    if (standardAccessRadio.checked) {
      if (!noExpDate && expDate.length == 0) {
        expirationDateInput.style.outline = "2px solid #e74c3c";
        expirationDateInput.addEventListener("input", () => expirationDateInput.style.outline = "none");
      }

      if (doors.length == 0 && levels.length == 0) {
        doorsDropDown.parentElement.style.outline = "2px solid #e74c3c";
        doorsDropDown.addEventListener("change", () => doorsDropDown.parentElement.style.outline = "none");

        levelsDropDown.parentElement.style.outline = "2px solid #e74c3c";
        levelsDropDown.addEventListener("change", () => levelsDropDown.parentElement.style.outline = "none");
      }
    }

    // SHOW ERROR MESSAGE
    modals.showOuternModal("Empty Fields", "Please enter all the required information on the feilds. Empty fields are not allowed.");
  }
}