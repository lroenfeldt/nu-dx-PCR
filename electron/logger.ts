import { app } from "electron";
import fs from "fs";
import moment from "moment";
import path from "path";
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

/**
 * @description log events
 * @param {string} message
 * @param {string} logName
 * @returns {void}
 * @example logger("Error spawning " + cmd + " " + args.join(" ") + ": " + data, "spawn.txt");
 **/

export const logger = async (
  message: string,
  logName: string
): Promise<void> => {
  const logsDir: string = path.resolve(app.getPath("userData"), "logs");
  const launchTime = `${logName}-${moment().format("DD-MM-YYYY")}.txt`;
  const file = path.resolve(app.getPath("userData"), "logs", launchTime);
  const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${JSON.stringify(message)}\n`;

  try {
    if (!fs.existsSync(logsDir)) {
      await fs.promises.mkdir(logsDir);
    }
    await fs.promises.appendFile(file, logItem);
  } catch (error) {
    console.log(error);
  }
};
