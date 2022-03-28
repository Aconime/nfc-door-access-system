import * as call from '../global/call.js';
import * as refresh from '../global/refresh.js';
import * as modals from '../global/modals.js';

// LOAD ALL LEVELS ON MODAL DROPDOWN
$("#add-door-modal").modal({
  allowMultiple: true,
  closable: false,
  onShow: async () => {
    const doorLevelDropDown = document.getElementById("door-level-select");
    doorLevelDropDown.innerHTML = `<option value="">Select Level</option>`;

    let allLevels = await call.showAllLevels();

    for (let i = 0; i <= allLevels.length - 1; i++)
      doorLevelDropDown.innerHTML += `<option value="${allLevels[i].level_id}">${allLevels[i].level}</option>`;
  },
  onApprove: () => { return false },
  onHidden: () => {
    const doorTagInput = document.getElementById("door-tag-input")
    const doorNumberInput = document.getElementById("door-number-input")
    const doorLevelSelect = document.getElementById("door-level-select");

    doorTagInput.value = "";
    doorTagInput.style.outline = "none";

    doorNumberInput.value = "";
    doorNumberInput.style.outline = "none";

    $("#door-level-select").dropdown('clear');
    doorLevelSelect.parentElement.style.outline = "none";
  }
}).modal('attach events', '#open-new-door-modal', 'show');

const addNewDoorButton = document.getElementById("add-door-btn");
if (addNewDoorButton) addNewDoorButton.addEventListener("click", async () => {
  const doorTag = document.getElementById("door-tag-input");
  const doorNumber = document.getElementById("door-number-input");
  const doorIdentifier = doorTag.value + ":" + doorNumber.value;
  const doorLevel = document.getElementById("door-level-select");

  if (doorTag.value.length > 0 && doorNumber.value.length > 0 && doorLevel.value.length > 0) {
    if (doorTag.value.includes(":")) {
      doorTag.style.outline = "2px solid #e74c3c";
      doorTag.addEventListener("input", () => doorTag.style.outline = "none");

      modals.showInnerModal("Invalid Character", "You have entered an invalid character on the fields, please make sure you enter text and numbers only.");
    } else if (doorNumber.value.includes(":")) {
      doorNumber.style.outline = "2px solid #e74c3c";
      doorNumber.addEventListener("input", () => doorNumber.style.outline = "none");

      modals.showInnerModal("Invalid Character", "You have entered an invalid character on the fields, please make sure you enter text and numbers only.");
    } else {
      let addDoorResult = await call.addNewDoor(doorIdentifier, doorLevel.value);
      if (addDoorResult.success == "true") {
        refresh.refreshAllDoorsList();
        $("#add-door-modal").modal('hide');
      }
      else 
      modals.showInnerModal("Authentication Error", "Unable to add the new door to the list. Please try again or contact your administrator for further assistance.");
    }
  } else {
    if (doorTag.value.length == 0) {
      doorTag.style.outline = "2px solid #e74c3c";
      doorTag.addEventListener("input", () => doorTag.style.outline = "none");
    }
  
    if (doorNumber.value.length == 0) {
      doorNumber.style.outline = "2px solid #e74c3c";
      doorNumber.addEventListener("input", () => doorNumber.style.outline = "none");
    }
  
    if (doorLevel.value == 0) {
      doorLevel.parentElement.style.outline = "2px solid #e74c3c";
      doorLevel.addEventListener("change", () => doorLevel.parentElement.style.outline = "none");
    }

    modals.showInnerModal("Empty Fields", "Please enter all the required information on the feilds. Empty fields are not allowed.");
  }
});

