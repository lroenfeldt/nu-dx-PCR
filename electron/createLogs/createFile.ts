import fs from "fs";
import { app } from "electron";
import path from "path";
import { format } from "date-fns";

export const createFile = async (): Promise<void> => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd-MM-yyyy");
  const hours = format(currentDate, "HH");
  const minutes = format(currentDate, "mm");

  const fileName = `${formattedDate}-${hours}-${minutes}.txt`;
  const filePath = path.resolve(app.getPath("userData"), "logs", fileName);

  const log = fs.promises.writeFile(filePath, "");
  const logsDir: string = path.resolve(app.getPath("userData"), "logs");

  try {
    if (!fs.existsSync(logsDir)) await fs.promises.mkdir(logsDir);
    if (!log) log;
  } catch (error) {
    console.log(`createFile.ts: ${error}`);
  }
};
