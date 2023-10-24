import fs from "fs";
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

export const logger = (message: string): void => {
  const dateTime = `${new Date().toLocaleString("DE-de")}`;
  const logItem = `${dateTime}\t${uuid()}\t${JSON.stringify(message)}\n`;
  const logsDir: string = path.resolve(app.getPath("userData"), "logs");

  try {
    fs.readdir(logsDir, (err, files) => {
      const lastFile = files[files.length - 1];
      const filePath = path.join(logsDir, lastFile)
      fs.promises.appendFile(filePath, logItem);
      setTimeout(() => {
        fs.stat(filePath, (_err, stats) => {
          if (stats.size >= 500000) {
            fs.promises.writeFile(filePath, "")
          }
        });
      },5000)
      
    });

  } catch (error) {
    console.error(error);
  }
};