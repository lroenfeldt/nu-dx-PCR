import fs from "fs";
import { app } from "electron";
import path from "path";
import moment from "moment";
import "moment/dist/locale/de";

export const createFile: () => void = () => {
  const fileName = `logs-${moment().format("DD-MM-YYYY")}-${new Date().getHours().toLocaleString("de-DE")}-${new Date().getMinutes().toLocaleString("de-DE")}.txt`;
  const filePath = path.resolve(app.getPath("userData"), "logs", fileName);
  const log = fs.promises.writeFile(filePath, "");
  const logsDir: string = path.resolve(app.getPath("userData"), "logs");

  try {
    if (!fs.existsSync(logsDir)) {
      fs.promises.mkdir(logsDir);
    }
    
    if (!log) {
      log;
    }
  
    } catch (error) {
  console.error(error);
  }
};
