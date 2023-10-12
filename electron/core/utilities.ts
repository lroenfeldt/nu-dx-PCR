import { app, ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";

export function copyLogos(): void {
  // logic for copying directories
  /**
   * copy logos to the app folder
   * @returns {void}
   * */
  ipcMain.handle("copyLogos", async (event) => {
    try {
      const logosPath = path.resolve(__dirname, "../src/assets/Logos");
      const destPath = path.resolve(app.getPath("userData"), "logos");
      copyDir(logosPath, destPath);
    } catch (err) {
      console.log(err);
    }
    return true;
  });
}

function copyDir(src: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  const files = fs.readdirSync(src);

  for (let i = 0; i < files.length; i++) {
    const current = fs.lstatSync(path.join(src, files[i]));
    if (current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]));
    } else if (current.isSymbolicLink()) {
      const symlink = fs.readlinkSync(path.join(src, files[i]));
      fs.symlinkSync(symlink, path.join(dest, files[i]));
    } else {
      fs.copyFileSync(path.join(src, files[i]), path.join(dest, files[i]));
    }
  }
}
