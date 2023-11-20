import * as path from "path";
import * as fs from "fs";
import { app } from "electron";

export const deleteFiles = () => {
  try {
    const logsDir: string = path.resolve(app.getPath("userData"), "logs");
    const files = fs.readdirSync(logsDir);
    files.forEach(async (file) => {
      const filePath = path.join(logsDir, file);
      const { birthtime } = await fs.promises.stat(filePath);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - birthtime.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 30) fs.promises.unlink(filePath);
    });
  } catch (error) {
    console.log(`delete.ts: ${error}`);
  }
};
