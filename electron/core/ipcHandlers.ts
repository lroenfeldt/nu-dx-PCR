import { IpcMainInvokeEvent, app, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { logger } from "../logger";
import os from "os";
import { IGetResultResponse } from "../interfaces/interfaces";

export function checkResultFileHandler(): void {
  // logic for IPC handler "checkResultFile"
  /**check if result file is present and move to run directory*/
  ipcMain.handle("checkResultFile", (event, testid) => {
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
  ipcMain.handle("moveResultFile", (event, testid) => {
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
      console.log(successMsg);
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

export function getResult(): void {
  ipcMain.handle(
    "getResult",
    async (
      event: IpcMainInvokeEvent,
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
        console.log(
          "test launch file not found, defaulting to current time for test start"
        );
        logger(
          "test launch file not found, defaulting to current time for test start"
        );
        testStarted = Date.now();
      }

      try {
        resultFile = fs.readFileSync(filepath, "utf-8");
      } catch (error: any) {
        console.log(`error accessing result file for test ${testid}`);
        console.error(error);
        logger(`error accessing result file for test ${testid}`);
        logger(error.message);
        throw error;
      }

      try {
        configFile = fs.readFileSync(configPath, "utf-8");
      } catch (error: any) {
        console.log(`error accessing config file for test ${testid}`);
        console.error(error);
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
