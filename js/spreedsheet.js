import { Calculate } from "./calculate.js";
import {
  formatTaskName,
  formatTaskPoints,
  formatTaskFront,
  formatDateEnd,
} from "./formatters.js";

import { rendertotalPoints, rendertotalResults } from "./htmlElements.js";

export const Spreedsheet = {
  spreadsheetId: "1rqDi_CXdIQ5yRAiyouQQ3TFp1kVVvf_zt48eDDvx9rA",
  range: "A1:E98",
  totalPoints: 0,
  AndrewsPoints: 0,
  AyrtonPoints: 0,
  CaioPoints: 0,
  VitorPoints: 0,
  returnTasks: async function () {
    let response;
    try {
      // Fetch first 10 files
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: Spreedsheet.spreadsheetId,
        range: Spreedsheet.range,
      });
    } catch (err) {
      document.getElementById("content").innerText = err.message;
      return;
    }
    // console.log(response.result);
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
      console.log("Sem resultados");
      return;
    }
    Spreedsheet.formatTasks(response);
    return;
  },
  formatTasks: function (tasks) {
    console.log("formatTasks", tasks);
    if (!tasks.result.values) return;

    let newTasks = [];

    for (let task of tasks.result.values) {
      if (task.length >= 3) {
        let taskName = task[0];
        let name = task[1];
        let date = task[3];

        let nameFront = formatTaskFront(name);
        let nameTask = formatTaskName(taskName);
        let pointsTask = formatTaskPoints(taskName);
        let dateEndTask = formatDateEnd(date);

        newTasks.push([nameTask, pointsTask, nameFront, dateEndTask]);
      }
    }
    Spreedsheet.insertValues(newTasks);
  },
  insertValues: async function (values) {
    console.log("insertValues");
    await gapi.client.sheets.spreadsheets.values
      .update({
        spreadsheetId: "1rqDi_CXdIQ5yRAiyouQQ3TFp1kVVvf_zt48eDDvx9rA",
        range: "Sheet2", // Pode ser ajustado conforme necessário
        valueInputOption: "RAW",
        resource: {
          values: values,
        },
      })
      .then(
        (response) => {
          rendertotalResults(values.length);
          rendertotalPoints(Calculate.showTotalPoints())
          console.log("Valores inseridos com sucesso:", response.result);
        },
        (error) => {
          console.error("Erro ao inserir valores:", error.result.error.message);
        }
      );
  },
};
