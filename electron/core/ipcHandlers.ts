import * as fs from "fs";
import * as path from "path";
import { app, ipcMain } from "electron";
import os from "os";
import { IGetResultResponse } from "../interfaces/interfaces";
import { logger } from "../createLogs/logger";

export function checkResultFileHandler(): void {
  // logic for IPC handler "checkResultFile"
  /**check if result file is present and move to run directory*/
  ipcMain.handle("checkResultFile", (_event, testid) => {
    if (testid === "demo") {
      return true;
    }

    const filepath = path.resolve(os.homedir(), "Documents", `${testid}.csv`);
    const destDir = path.resolve(app.getPath("userData"), "runs", testid);
    const destpath = path.resolve(destDir, `${testid}.csv`);

    try {
      fs.accessSync(filepath, fs.constants.F_OK);
    } catch (error: any) {
      const errorMsg = `Result file "${filepath}" is not present or not readable: ${error.message}`;
      console.error(errorMsg);
      logger(errorMsg);
      return false;
      return;
    }

    try {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      return true;
    } catch (error: any) {
      const errorMsg = `Result file "${filepath}" could not be moved to "${destpath}" due to error: ${error.message}`;
      console.error(errorMsg);
      logger(errorMsg);
      return false;
    }
  });
}

export function moveResultFileHandler(): void {
  // logic for IPC handler "moveResultFile"
  /**move resultfile to run directory*/
  ipcMain.handle("moveResultFile", (_event, testid) => {
    if (testid === "demo") {
      return true;
    }

    const filepath = path.resolve(os.homedir(), "Documents", `${testid}.csv`);
    const destpath = path.resolve(
      app.getPath("userData"),
      "runs",
      testid,
      testid + ".csv"
    );

    try {
      fs.renameSync(filepath, destpath);
      const successMsg = `Result file successfully moved to "${destpath}"`;
      logger(successMsg);
      return true;
    } catch (error: any) {
      const errorMsg = `Result file "${filepath}" could not be moved to "${destpath}" due to error: ${error.message}`;
      console.error(errorMsg);
      logger(errorMsg);
      return false;
    }
  });
}

export function getResultHandler(): void {
  ipcMain.handle(
    "getResult",
    async (
      _event: Electron.IpcMainInvokeEvent,
      testid: string,
      done: boolean
    ): Promise<IGetResultResponse> => {
      logger(`getResult ${testid}`);

      const baseDir = path.resolve(
        app.getPath("userData"),
        "runs",
        done && testid !== "demo" ? "done" : "",
        testid
      );
      const filepath = path.join(baseDir, `${testid}.csv`);
      const configPath = path.join(baseDir, "config.json");
      const launchFilePath = path.join(baseDir, "lineGeneSetup.xml");
      const overridePath = path.join(baseDir, "override.json");

      let resultFile = "";
      let configFile = "";
      let testStarted: number | Date;

      try {
        testStarted = fs.statSync(launchFilePath).mtime;
      } catch (error) {
        logger(
          "test launch file not found, defaulting to current time for test start"
        );
        testStarted = Date.now();
      }

      try {
        resultFile = fs.readFileSync(filepath, "utf-8");
      } catch (error: any) {
        console.error(`error accessing result file for test ${testid}`);

        logger(`error accessing result file for test ${testid}`);

        throw error;
      }

      try {
        configFile = fs.readFileSync(configPath, "utf-8");
      } catch (error: any) {
        console.error(`error accessing config file for test ${testid}`);
        logger(error.message);
      }

      const override = fs.existsSync(overridePath)
        ? fs.readFileSync(overridePath, "utf-8")
        : false;

      return { resultFile, configFile, testStarted, override };
    }
  );
}

export function getVersion() {
  /**
   * Provide App Version
   * @returns {string}  version
   * */
  ipcMain.handle("getVersion", (_event) => {
    return app.getVersion();
  });
}
