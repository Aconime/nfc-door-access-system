import * as refresh from '../global/refresh.js';

// const allDoorsTabButton = document.getElementById("all-doors-tab-btn");
// if (allDoorsTabButton) allDoorsTabButton.addEventListener("click", refresh.refreshAllDoorsList());

// const allLevelsTabButton = document.getElementById("all-levels-tab-btn");
// if (allLevelsTabButton) allLevelsTabButton.addEventListener("click", refresh.refreshAllLevelsList());

const allCardsTabButton = document.getElementById("all-cards-tab-btn");
if (allCardsTabButton) allCardsTabButton.addEventListener("click", () => refresh.refreshAllCardsList());

const allClientsTabButton = document.getElementById("all-clients-tab-btn");
if (allClientsTabButton) allClientsTabButton.addEventListener("click", () => refresh.refreshAllClients());