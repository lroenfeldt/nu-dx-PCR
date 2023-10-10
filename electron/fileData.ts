import moment from "moment";
import "moment/dist/locale/de";
import { app } from "electron";
import path from "path";

const fileName = `logs-${moment().format("DD-MM-YYYY")}-${moment()
  .locale("de")
  .format("LT")}.txt`;

export const filePath = path.resolve(app.getPath("userData"), "logs", fileName);

export const logsDir: string = path.resolve(app.getPath("userData"), "logs");
