import moment from "moment";
import "moment/dist/locale/de";
import { app } from "electron";
import path from "path";
import fs from "fs";

const fileName = `logs-${moment().format("DD-MM-YYYY")}-${moment()
  .locale("de")
  .format("LT")}.txt`;

export const filePath = path.resolve(app.getPath("userData"), "logs", fileName);

export const log = fs.promises.writeFile(filePath, "");

export const logsDir: string = path.resolve(app.getPath("userData"), "logs");
