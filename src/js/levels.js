import * as call from '../global/call.js';
import * as refresh from '../global/refresh.js';
import * as modals from '../global/modals.js';

// REFRESH LEVELS LSIT FUNCTION
async function refreshLevelList() {
  let refreshResults = await refresh.refreshAllLevelsList();

  for (let i = 0; i <= refreshResults.length - 1; i++) {
    const delButton = document.getElementById(refreshResults[i].button_id);
    delButton.addEventListener("click", () => {
      modals.showInnerQuestionModal("Delete Level?", "Are you sure you want to delete this level and completely remove it from the list?", async () => {
        let deleteLevelResult = await call.deleteLevel(refreshResults[i].level_id);
        if (deleteLevelResult.success == "true") 
          refreshLevelList();
        else 
          modals.showInnerModal("Authentication Error", "Unable to remove this level from the list. Please try again or contact your administrator for further assistance.");
      });
    })
  }
}

const allLevelsTabButton = document.getElementById("all-levels-tab-btn");
if (allLevelsTabButton) allLevelsTabButton.addEventListener("click", () => {
  refreshLevelList();
});

// SHOW ADD NEW DOOR MODAL
$("#add-level-modal").modal({
  allowMultiple: true,
  closable: false,
  onApprove: () => { 
    createLevel();
    return false;
  },
  onHidden: () => clearModalInputs()
}).modal('attach events', '#open-new-level-modal', 'show');

const levelModalInput = document.getElementById("level-name-input");

function clearModalInputs() {
  levelModalInput.value = "";
  levelModalInput.style.outline = "none";
}

async function createLevel() {
  if (levelModalInput.value.length > 0) {
    let addLevelResult = await call.addNewLevel(levelModalInput.value);
    if (addLevelResult.success == "true") {
      refreshLevelList();
      $("#add-level-modal").modal('hide');
    }
    else 
      modals.showInnerModal("Authentication Error", "Unable to add the new door to the list. Please try again or contact your administrator for further assistance.");
  } else {
    levelModalInput.style.outline = "2px solid #e74c3c";
    levelModalInput.addEventListener("input", () => levelModalInput.style.outline = "none");
  }
}