import fs from "fs";
import { log, logsDir } from "./fileData";
import { deleteLogs } from "./deleteLogs";

export const createFile: () => void = () => {

  try {
    if (!fs.existsSync(logsDir)) {
      fs.promises.mkdir(logsDir);
    }
    if (!log) {
      log;
    }
    deleteLogs()
    } catch (error) {
  console.error(error);
  }
};
