import { app } from "electron";
import * as path from "path";
import * as fs from "fs";

// delete saved logs after 30 days
export const deleteLogs = () => {
  const folderPath = path.resolve(app.getPath("userData"), "logs");

  fs.readdir(folderPath, (_err, files) => {
    files.forEach((file) => {
      const matches = file.match(/[a-z, A-Z]-(\d{2})-(\d{2})-(\d{4})\.txt/);
      if (!matches) return;

      const fileDay = Number(matches[1]);
      const fileMonth = Number(matches[2]) - 1;
      const fileYear = Number(matches[3]);

      const fileDate = new Date(fileYear, fileMonth, fileDay);

      const today = new Date();
      const diffTime = Math.abs(today.getTime() - fileDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 30) {
        const filePath = path.join(folderPath, file);
        fs.promises.unlink(filePath);
      }
    });
  });
};
