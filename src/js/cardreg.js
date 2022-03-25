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

const cardAdminAccessRad = document.getElementById("adminrad");
if (cardAdminAccessRad) cardAdminAccessRad.addEventListener("change", () => cardAccessLevel(1));

const cardStandardAccessRad = document.getElementById("standrad");
if (cardAdminAccessRad) cardStandardAccessRad.addEventListener("change", () => cardAccessLevel(0));