import * as modals from '../global/modals.js';
import * as refresh from '../global/refresh.js';
import * as call from '../global/call.js';

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
  } else if (formatType == 2) {
    let date = new Date(formatDate);
    let y = date.getFullYear();
    let m = date.getMonth()+1;
    let d = date.getDate();
    let h = date.getHours()-1;
    if (h == -1) {
      h = 23;
      d = d - 1;
    }
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

window.onload = async () => { 
  await refresh.refreshAllClients();

  localStorage.setItem("currentDate", new Date());

  await listenForLogs();
}

const logoutButton = document.getElementById("logout-button");
if (logoutButton) logoutButton.addEventListener("click", () => {
  modals.showOuternQuestionModal("Logout?", "Are you sure you want to logout?", () => {
    localStorage.clear();
    location.href = "./login.html";
  })
});

async function listenForLogs() {
  setInterval(async () => {
    let logs = await call.showAllLogsWithParams(getDateFormat(2, localStorage.getItem("currentDate")));
    if (logs.length != 0) {
      $("body")
      .toast({
        title: "Potential Card Exploit",
        message: logs[0].message,
        class : "red",
        showProgress: "bottom",
        showIcon: "exclamation circle"
      });
    }
  }, 5000);

  setInterval(() => {
    localStorage.setItem("currentDate", new Date());
  }, 1000);
}
