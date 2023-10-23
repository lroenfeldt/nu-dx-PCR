import fs from "fs";
import { filePath, logsDir } from "./fileData";

export const createFile: () => void = () => {
  const log = fs.promises.writeFile(filePath, "");

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
