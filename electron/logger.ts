import fs from "fs";
const { v4: uuid } = require("uuid");
import moment from "moment";
import "moment/dist/locale/de";
import { filePath } from "./fileData";

/**
 * @description log events
 * @param {string} message
 * @returns {void}
 * @example logger("Error spawning " + cmd + " " + args.join(" ") + ": " + data, "spawn.txt");
 **/

export const logger = (message: string): void => {
  const dateTime = `${moment().format("DD-MM-YYYY")}-${moment()
    .locale("de")
    .format("LT")}`;
  const logItem = `${dateTime}\t${uuid()}\t${JSON.stringify(message)}\n`;

  try {
    fs.stat(filePath, (_err, stats) => {
      if (stats.size >= 500000) {
        fs.promises.writeFile(filePath, "");
      }
    });
    fs.promises.appendFile(filePath, logItem);
  } catch (error) {
    console.error(error);
  }
};
