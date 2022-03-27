import * as refresh from './global/refresh.js';

const allDoorsTabButton = document.getElementById("all-doors-tab-btn");
if (allDoorsTabButton) allDoorsTabButton.addEventListener("click", refresh.refreshAllDoorsList());
 