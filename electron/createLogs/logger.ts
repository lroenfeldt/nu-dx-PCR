import fs, { readdirSync } from "fs";
const { v4: uuid } = require("uuid");
import "moment/dist/locale/de";
import { app } from "electron";
import path from "path";

/**
 * @description log events
 * @param {string} message
 * @returns {void}
 * @example logger("Error spawning " + cmd + " " + args.join(" ") + ": " + data, "spawn.txt");
 **/

export const logger = async (message: string): Promise<void> => {
  const dateTime = `${new Date().toLocaleString("DE-de")}`;
  const logItem = `${dateTime}\t${uuid()}\t${JSON.stringify(message)}\n`;
  const logsDir: string = path.resolve(app.getPath("userData"), "logs");

  const files = fs.readdirSync(logsDir);
  let latestFileDate = 0;
  let latestFilePath = "";

  try {
    files.forEach((file) => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      if (stats.birthtimeMs > latestFileDate) {
        latestFileDate = stats.birthtimeMs;
        latestFilePath = filePath;
      }
    });

    if (!latestFilePath) return;
    fs.promises.appendFile(latestFilePath, logItem);
    const { size } = await fs.promises.stat(latestFilePath);
    if (size > 500000) fs.promises.writeFile(latestFilePath, "");
  } catch (error) {
    console.log(error);
  }
};
