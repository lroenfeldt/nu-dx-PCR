import fs from "fs";
import { app } from "electron";
import path from "path";

export const createFile: () => void = () => {
  const fileName = `logs-${new Date().toLocaleDateString("DE-de")}-${new Date().getHours()}-${new Date().getMinutes().toLocaleString("DE-de")}.txt`;
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