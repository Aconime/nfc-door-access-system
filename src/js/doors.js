// IMPORTS
import * as call from '../global/call.js';
import * as refresh from '../global/refresh.js';
import * as modals from '../global/modals.js';

// REFRESH DOOR LSIT FUNCTION
async function refreshDoorList() {
  let refreshResults = await refresh.refreshAllDoorsList();

  for (let i = 0; i <= refreshResults.length - 1; i++) {
    $("#door-modal").modal({
      allowMultiple: true,
      closable: false,
      onShow: () => loadModalData(1, refreshResults[i].door_id),
      onApprove: () => { return false },
      onHidden: () => clearModalInputs()
    }).modal('attach events', `#${refreshResults[i].button_id}`, 'show');
  }
}

// GET ALL 'EDIT' BUTTONS FROM THE LSIT
let globalDoorId;

const allDoorsTabButton = document.getElementById("all-doors-tab-btn");
if (allDoorsTabButton) allDoorsTabButton.addEventListener("click", () => {
  refreshDoorList();
});

// SHOW ADD NEW DOOR MODAL
$("#door-modal").modal({
  allowMultiple: true,
  closable: false,
  onShow: () => loadModalData(0),
  onApprove: () => { return false },
  onHidden: () => clearModalInputs()
}).modal('attach events', '#open-new-door-modal', 'show');

// LOAD REQUIRED DATA FOR THE MODAL
async function loadModalData(modalType, doorId=null) {
  const doorLevelDropDown = document.getElementById("door-level-select");
  doorLevelDropDown.innerHTML = `<option value="">Select Level</option>`;

  let allLevels = await call.showAllLevels();

  for (let i = 0; i <= allLevels.length - 1; i++)
    doorLevelDropDown.innerHTML += `<option value="${allLevels[i].level_id}">${allLevels[i].level}</option>`;

  if (modalType == 1) {
    globalDoorId = null;
    const doorModalTitle = document.getElementById("door-modal-title");
    const doorModalMainButton = document.getElementById("main-door-btn");
    const doorModalDeleteButton = document.getElementById("delete-door-btn");
    const doorModalStatusField = document.getElementById("door-status-field");
    const doorTagInput = document.getElementById("door-tag-input");
    const doorNumberInput = document.getElementById("door-number-input");

    doorModalTitle.innerText = "Edit Door";
    doorModalMainButton.innerHTML = `<i class="fas fa-save"></i> Save Changes`;
    doorModalMainButton.classList.remove('add-door-btn');
    doorModalDeleteButton.classList.remove("hidden-modal-element");
    doorModalStatusField.classList.remove("hidden-modal-element");

    let allDoors = await call.showAllDoors();
    for (let i = 0; i <= allDoors.length - 1; i++) {
      if (doorId == allDoors[i].door_id) {
        globalDoorId = doorId;

        let doorTag = allDoors[i].door_identifier.split(":")[0];
        let doorNumber = allDoors[i].door_identifier.split(":")[1];
        doorTagInput.value = doorTag;
        doorNumberInput.value = doorNumber;
        $('#door-level-select').dropdown('set selected', allDoors[i].door_access_level_id);
        if (allDoors[i].is_active == 0) 
          $('#door-status-select').dropdown('set selected', 1);
        else
          $('#door-status-select').dropdown('set selected', 0);
        break;
      }
    }
  }
}

// CLEAR ALL INPUTS FROM MODAL
function clearModalInputs() {
  globalDoorId = null;

  const doorModalTitle = document.getElementById("door-modal-title");
  const doorModalMainButton = document.getElementById("main-door-btn");
  const doorModalDeleteButton = document.getElementById("delete-door-btn");
  const doorModalStatusField = document.getElementById("door-status-field");

  doorModalTitle.innerText = "Add New Door";
  doorModalMainButton.innerHTML = `<i class="fas fa-check"></i> Add Door`;
  doorModalMainButton.classList.add('add-door-btn');
  doorModalDeleteButton.classList.add("hidden-modal-element");
  doorModalStatusField.classList.add("hidden-modal-element");

   const doorTagInput = document.getElementById("door-tag-input");
   const doorNumberInput = document.getElementById("door-number-input");
   const doorLevelSelect = document.getElementById("door-level-select");
   const doorStatusSelect = document.getElementById("door-status-select");

   doorTagInput.value = "";
   doorTagInput.style.outline = "none";

   doorNumberInput.value = "";
   doorNumberInput.style.outline = "none";

   $("#door-level-select").dropdown('clear');
   doorLevelSelect.parentElement.style.outline = "none";

   $("#door-status-select").dropdown('clear');
   doorStatusSelect.parentElement.style.outline = "none";
}

// ADD NEW DOOR
const mainDoorButton = document.getElementById("main-door-btn");
if (mainDoorButton) mainDoorButton.addEventListener("click", async () => {
  let doorModalActionType;

  if (mainDoorButton.classList.contains("add-door-btn")) doorModalActionType = 0;
  else doorModalActionType = 1;
  
  mainDoorModalFunction(doorModalActionType);
});


// MODAL MAIN BUTTON FUNCTION
async function mainDoorModalFunction(actionType) {
  // GET INPUTS
  const doorTag = document.getElementById("door-tag-input");
  const doorNumber = document.getElementById("door-number-input");
  const doorIdentifier = doorTag.value + ":" + doorNumber.value;
  const doorLevel = document.getElementById("door-level-select");
  const doorStatus = document.getElementById("door-status-select");

  // CHECK IF ALL INPUTS ARE FILLED
  if (doorTag.value.length > 0 && doorNumber.value.length > 0 && doorLevel.value.length > 0) {
    // CHECK FOR INVALID CHARACTERS
    if (doorTag.value.includes(":")) {
      doorTag.style.outline = "2px solid #e74c3c";
      doorTag.addEventListener("input", () => doorTag.style.outline = "none");

      modals.showInnerModal("Invalid Character", "You have entered an invalid character on the fields, please make sure you enter text and numbers only.");
    } else if (doorNumber.value.includes(":")) {
      doorNumber.style.outline = "2px solid #e74c3c";
      doorNumber.addEventListener("input", () => doorNumber.style.outline = "none");

      modals.showInnerModal("Invalid Character", "You have entered an invalid character on the fields, please make sure you enter text and numbers only.");
    } else {
      if (actionType == 0) {
        let addDoorResult = await call.addNewDoor(doorIdentifier, doorLevel.value);
        if (addDoorResult.success == "true") {
          refreshDoorList();
          $("#door-modal").modal('hide');
        }
        else 
          modals.showInnerModal("Authentication Error", "Unable to add the new door to the list. Please try again or contact your administrator for further assistance.");
      } else {
        if (doorStatus.value.length > 0) {
          let doorStatusValue;

          if (doorStatus.value == 0) doorStatusValue = 1;
          else if (doorStatus.value == 1) doorStatusValue = 0;

          console.log(doorStatusValue);

          let editDoorResult = await call.editDoor(globalDoorId, doorIdentifier, doorLevel.value, doorStatusValue);
          if (editDoorResult.success == "true") {
            $("#door-modal").modal('hide');
            refreshDoorList();
          }
          else
            modals.showInnerModal("Authentication Error", "Unable to edit this door. Please try again or contact your administrator for further assistance.");
        } else {
          doorStatus.parentElement.style.outline = "2px solid #e74c3c";
          doorStatus.addEventListener("input", () => doorStatus.parentElement.style.outline = "none");
        }
      }
    }
  } else {
    // CHECK IF DOOR TAG IS EMPTY
    if (doorTag.value.length == 0) {
      doorTag.style.outline = "2px solid #e74c3c";
      doorTag.addEventListener("input", () => doorTag.style.outline = "none");
    }
  
    // CHECK IF DOOR NUMBER IS EMPTY
    if (doorNumber.value.length == 0) {
      doorNumber.style.outline = "2px solid #e74c3c";
      doorNumber.addEventListener("input", () => doorNumber.style.outline = "none");
    }
    
    // CHECK IF DROPDOWN IS EMPTY
    if (doorLevel.value == 0) {
      doorLevel.parentElement.style.outline = "2px solid #e74c3c";
      doorLevel.addEventListener("change", () => doorLevel.parentElement.style.outline = "none");
    }

    if (actionType == 1 && doorStatus.value.length <= 0) {
      doorStatus.parentElement.style.outline = "2px solid #e74c3c";
      doorStatus.addEventListener("change", () => doorStatus.parentElement.style.outline = "none");
    }

    // SHOW ERROR MESSAGE
    modals.showInnerModal("Empty Fields", "Please enter all the required information on the feilds. Empty fields are not allowed.");
  }
}
 
const deleteDoorModalButton = document.getElementById("delete-door-btn");
if (deleteDoorModalButton) deleteDoorModalButton.addEventListener("click", () => {
  modals.showInnerQuestionModal("Delete Door?", "Are you sure you want to delete this door and completely remove it from the list?", async () => {
    let deleteDoorResult = await call.deleteDoor(globalDoorId);
    if (deleteDoorResult.success == "true") {
      refreshDoorList();
      setTimeout(() => {
        $("#door-modal").modal('hide');
      }, 1000);
    }
    else 
      modals.showInnerModal("Authentication Error", "Unable to remove this door from the list. Please try again or contact your administrator for further assistance.");
  });
});