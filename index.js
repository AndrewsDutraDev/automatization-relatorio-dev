import { GAPI } from "./js/gapi.js";

function buttonsListeners() {
  let authorize = document.getElementById("authorize_button");
  let signout_button = document.getElementById("signout_button");

  authorize.addEventListener("click", () => {
    GAPI.handleAuthClick();
  });

  signout_button.addEventListener("click", () => {
    GAPI.handleSignoutClick();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  GAPI.init();
  buttonsListeners();
});
