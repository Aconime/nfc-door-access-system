import * as api from './global/api.js';

window.onload = () => localStorage.clear();

const loginButton = document.getElementById('login-btn');
if (loginButton) loginButton.addEventListener('click', () => {
  // User Login Details
  const usernameField = document.getElementById('username-field').value;
  const passwordField = document.getElementById('password-field').value;

  // API Request to login
  fetch(api.login + "?username=" + usernameField + "&password=" + passwordField)
    .then(res => res.json())
    .then(data => {
      if (data.success == "true") {
        localStorage.setItem("userToken", data.api_token);
        localStorage.setItem("username", usernameField);

        showLoginStatusBar("Login Successful", "Please wait while you are being redirected to the dashboard.", 0);
      } else {
        if (data.error == "Invalid Credentials") 
          showLoginStatusBar(data.error, "Please make sure you have entered your details correctly and try again.", 1);
        else 
          showLoginStatusBar("System Error", "Please contact your administrator for further assistance.", 1);
      }
    });
});

let visibilityTimeout;
function showLoginStatusBar(title, message, type, timelength=2500) {
  // Status Of User's Login
  const loginInfoBar = document.getElementById("login-info-bar");
  const loginInfoBarTitle = document.getElementById("login-info-bar-title");
  const loginInfoBarMessage = document.getElementById("login-info-bar-message");

  loginInfoBarTitle.innerText = title;
  loginInfoBarMessage.innerText = message;
  
  if (type == 0) {
    loginInfoBar.classList.add("success");
    loginInfoBar.classList.remove("warning");
  } else {
    loginInfoBar.classList.add("warning");
    loginInfoBar.classList.remove("success");
  }

  loginInfoBar.classList.add("visible");
  loginInfoBar.classList.remove("hidden");

  if (visibilityTimeout != null) clearTimeout(visibilityTimeout);

  visibilityTimeout = setTimeout(() => {
    if (type == 0) location.href = "./index.html";
    else removeLoginStatusBar(loginInfoBar);
  }, timelength);
}

function removeLoginStatusBar(loginInfoBarId) {
  loginInfoBarId.classList.add("hidden");
  loginInfoBarId.classList.remove("visible");
  loginInfoBarId.classList.remove("success");
  loginInfoBarId.classList.remove("warning");
}