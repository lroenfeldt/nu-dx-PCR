import * as fs from "fs";
import * as path from "path";
import { app, ipcMain } from "electron";

export async function archiveRun() {
  // archive run folder
  ipcMain.handle("archiveRun", async () => {
    const userDataPath = app.getPath("userData");
    const filepath = path.join(userDataPath, "runs");
    const destpath = path.join(userDataPath, "archive");

    try {
      if (!fs.existsSync(destpath)) {
        fs.mkdirSync(destpath);
      }
      if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
      }

      const files = fs.readdirSync(filepath, { withFileTypes: true });

      for (let file of files) {
        if (file.isDirectory() && file.name !== "demo") {
          const sourcePath = path.join(filepath, file.name);
          let destPath = path.join(destpath, file.name);

          if (fs.existsSync(destPath)) {
            const timestamp = Date.now();
            destPath = path.join(destpath, `${file.name}_${timestamp}`);
          }

          fs.renameSync(sourcePath, destPath);
        }
      }
    } catch (error) {
      console.error(`Failed to archive runs: ${error}`);
      throw error; // re-throw the error to be handled by the renderer process
    }
  });
}

export function fileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

export function moveFiles() {
  /**
   * @param {string} filePath
   * @returns {boolean}
   * @description Moves a test from the "runs" directory to the "done" directory
   * */
  ipcMain.handle("moveFiles", (_event, testid) => {
    if (testid !== "demo") {
      const sourcePath = path.resolve(app.getPath("userData"), "runs", testid);
      const destPath = path.resolve(
        app.getPath("userData"),
        "runs",
        "done",
        testid
      );
      try {
        fs.mkdirSync(destPath, { recursive: true });
        fs.readdirSync(sourcePath).forEach((file) => {
          fs.renameSync(
            path.resolve(sourcePath, file),
            path.resolve(destPath, file)
          );
        });
        fs.rmdirSync(sourcePath);
      } catch (err) {
        return err;
      }
    }
    return true;
  });
}

export function deleteAllOverrides() {
  /**
   * delete all override files
   * @returns {void}
   * */
  ipcMain.handle("deleteAllOverrides", async (_event) => {
    try {
      const destPath = path.resolve(app.getPath("userData"), "runs");
      const files = fs.readdirSync(destPath);
      files.forEach((file) => {
        const overridePath = path.resolve(destPath, file, "override.json");
        if (fs.existsSync(overridePath)) {
          fs.unlinkSync(overridePath);
        }
      });
    } catch (err) {
      console.error(err);
    }
    return true;
  });
}

export function deleteOverride() {
  /**
   * delete override file
   * @returns {void}
   * */
  ipcMain.handle("deleteOverride", async (_event, testid) => {
    try {
      const destPath = path.resolve(
        app.getPath("userData"),
        "runs",
        testid,
        "override.json"
      );
      if (fs.existsSync(destPath)) {
        fs.unlink(destPath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
    return true;
  });
}
