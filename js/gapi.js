import { Spreedsheet } from "./spreedsheet.js";

export const GAPI = {
  tokenClient: false,
  gapiInited: false,
  gisInited: false,
  tokenClient: null,
  // Discovery doc URL for APIs used by the quickstart
  DISCOVERY_DOC: "https://sheets.googleapis.com/$discovery/rest?version=v4",
  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  SCOPES: "https://www.googleapis.com/auth/spreadsheets",
  // TODO(developer): Set to client ID and API key from the Developer Console
  CLIENT_ID:
    "411197655266-25q85obh5nkee6rj9l03pa9odktrqt86.apps.googleusercontent.com",
  API_KEY: "AIzaSyA1-bWwEvTrmXfs0Plva0tpv56hGJ95j5M",
  handleAuthClick: function () {
    GAPI.tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      document.getElementById("signout_button").style.visibility = "visible";
      document.getElementById("authorize_button").innerText = "Refresh";
      await Spreedsheet.returnTasks();
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      GAPI.tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      GAPI.tokenClient.requestAccessToken({ prompt: "" });
    }
  },
  handleSignoutClick: function () {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      document.getElementById("content").innerText = "";
      document.getElementById("authorize_button").innerText = "Authorize";
      document.getElementById("signout_button").style.visibility = "hidden";
    }
  },
  /**
   * Enables user interaction after all libraries are loaded.
   */
  maybeEnableButtons: function () {
    if (GAPI.gapiInited && GAPI.gisInited) {
      document.getElementById("authorize_button").style.visibility = "visible";
    }
  },
  gapiLoaded: function () {
    gapi.load("client", GAPI.initializeGapiClient);
  },
  /**
   * Callback after the API client is loaded. Loads the
   * discovery doc to initialize the API.
   */
  initializeGapiClient: async function () {
    await gapi.client.init({
      apiKey: GAPI.API_KEY,
      discoveryDocs: [GAPI.DISCOVERY_DOC],
    });
    GAPI.gapiInited = true;
    GAPI.maybeEnableButtons();
  },
  /**
   * Callback after api.js is loaded.
   */
  /**
   * Callback after Google Identity Services are loaded.
   */
  gisLoaded: function () {
    GAPI.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GAPI.CLIENT_ID,
      scope: GAPI.SCOPES,
      callback: "", // defined later
    });
    GAPI.gisInited = true;
    GAPI.maybeEnableButtons();
  },
  init: function () {
    GAPI.gapiLoaded();
    GAPI.gisLoaded();
  },
};
