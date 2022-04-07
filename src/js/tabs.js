import * as refresh from '../global/refresh.js';

const allCardsTabButton = document.getElementById("all-cards-tab-btn");
if (allCardsTabButton) allCardsTabButton.addEventListener("click", () => refresh.refreshAllCardsList());

const allClientsTabButton = document.getElementById("all-clients-tab-btn");
if (allClientsTabButton) allClientsTabButton.addEventListener("click", () => refresh.refreshAllClients());

