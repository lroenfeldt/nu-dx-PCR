import { app } from "electron";
import * as path from "path";
import * as fs from "fs";

export const deleteLogs = () => {
  const folderPath = path.resolve(app.getPath("userData"), "logs");

  fs.readdir(folderPath, (_err, files) => {
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      fs.stat(filePath, (_err, stats) => {
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - stats.birthtime.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 30) {
          const filePath = path.join(folderPath, file);
          fs.promises.unlink(filePath);
        }
      });
    });
  });
};
