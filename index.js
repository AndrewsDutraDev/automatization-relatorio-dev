/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

var spreadsheetId = '1rqDi_CXdIQ5yRAiyouQQ3TFp1kVVvf_zt48eDDvx9rA'

let POsNames = ['Eduarda Lopes', 'Jéssica Lemes', 'Natália Kolm', 'Gabriela Mello']

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID =
  "411197655266-25q85obh5nkee6rj9l03pa9odktrqt86.apps.googleusercontent.com";
const API_KEY = "AIzaSyA1-bWwEvTrmXfs0Plva0tpv56hGJ95j5M";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://sheets.googleapis.com/$discovery/rest?version=v4";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById("authorize_button").style.visibility = "hidden";
document.getElementById("signout_button").style.visibility = "hidden";

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").style.visibility = "visible";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
    await returnTasks();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    document.getElementById("content").innerText = "";
    document.getElementById("authorize_button").innerText = "Authorize";
    document.getElementById("signout_button").style.visibility = "hidden";
  }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function returnTasks() {
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "A1:E98",
    });
  } catch (err) {
    document.getElementById("content").innerText = err.message;
    return;
  }
  console.log(response.result);
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    console.log("Sem resultados");
    return;
  }
  formatTasks(response);
  return;
}

function formatTasks(tasks) {
  console.log("formatTasks", tasks);
	if (!tasks.result.values) return	
	
	let newTasks = []

	for (task of tasks.result.values) {
		// console.log(task)
		if (task.length >= 3){
			console.log('tassssk', task)
			let taskName = task[0]
			let name = task[1]
			let date = task[3]

			let nameFront = formatTaskFront(name)
			let nameTask = formatTaskName(taskName)
			let pointsTask = formatTaskPoints(taskName)

			console.log('ANTES DA CHAMADA', date)

			let dateEndTask = formatDateEnd(date)


			newTasks.push([nameTask, pointsTask, nameFront, dateEndTask])
		}
	}
	console.log(newTasks)
	insertValues(newTasks)
}

function formatTaskName(taskName){
	let taskNameSplit = taskName.split('|')
	// taskNameSplit = taskNameSplit[0].replace(' ', '')
	return taskNameSplit[0]
}

function formatTaskPoints(taskPoints){
	let taskPointsSplit = taskPoints.split('|')
	// taskPointsSplit = taskPointsSplit[1].replace(' ', '')
	return taskPointsSplit[1]
}

function formatTaskFront(nameFrontPO){
	let name
	if (nameFrontPO){
		for (POname of POsNames){
			if (nameFrontPO.includes(POname)){
				name = nameFrontPO.replace(POname, '')
				name = name.replace(',', '')
				name = name.replace(' ', '')
			}
		}
		return name
	}
}

function formatDateEnd(date){
	let newdate
	date = date.toLowerCase()
	console.log('dateaaa', date)
	if (date){
		if (date.includes('ontem') || date.includes('hoje') || date.includes('atrás')){
			if (date.includes('ontem')){
				console.log('ontem')
				newdate = moment().subtract(1, 'days');
			}
			if (date.includes('hoje')){
				console.log('hoje')
				newdate = moment();
			}
			if (date.includes('atrás')){
				let dataString = date.split('dias')
				dataString = dataString[0].replace(' ', '')
				console.log('atrás', dataString)
				newdate = moment().subtract(parseInt(dataString), 'days');

				console.log('newdate atras', newdate)
			}
			newdate = newdate.format('DD/MM/YYYY');
		}else{
			newdate = date
		}
		
		return newdate
	}
}

async function insertValues(values) {
	console.log('insertValues')
	await gapi.client.sheets.spreadsheets.values.update({
		spreadsheetId: "1rqDi_CXdIQ5yRAiyouQQ3TFp1kVVvf_zt48eDDvx9rA",
		range: 'Sheet2', // Pode ser ajustado conforme necessário
		valueInputOption: 'RAW',
		resource: {
			values: values,
		},
	}).then((response) => {
		console.log('Valores inseridos com sucesso:', response.result);
	}, (error) => {
		console.error('Erro ao inserir valores:', error.result.error.message);
	});
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("loaded index.js 2.0");
  gapiLoaded();
  gisLoaded();
});
