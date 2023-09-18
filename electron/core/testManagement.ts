import { app, ipcMain } from "electron";
import { ILineGeneSettings, ITestObject } from "../interfaces/interfaces";
import * as fs from "fs";
import * as path from "path";
import { spawn } from "../spawn";
import { killProcess, lineGenePath, mainWindow } from "../main";
import { logger } from "../logger";

//Define IntervalId for keeping focus
let focusInterval: NodeJS.Timeout;

export function startTest(/* parameters */): void {
  // logic for starting a test
  /**
   * Start the test and run LineGene
   * @param {string} testid
   * @param {string} xmlContent
   * @param {object} settings
   * @param {Array} barcodes
   * @param {string} testmethod
   * @returns {Boolean} true if test started
   */
  ipcMain.handle(
    "startLineGene",
    (
      _event: Electron.IpcMainInvokeEvent,
      testid: string,
      xmlContent: string,
      settings: ILineGeneSettings,
      barcodes: string[],
      testmethod: string
    ): boolean => {
      // Mutate the settings object
      delete settings.account.authToken;
      settings.barcodes = barcodes;
      settings.testid = testid;
      settings.testmethod = testmethod;

      const pcrServerPath = "C:\\Bioer\\PcrServer\\bin\\PcrServer.exe";
      const xmlPath = path.resolve(
        app.getPath("userData"),
        "runs",
        testid,
        "lineGeneSetup.xml"
      );
      const outputPath = path.resolve(
        app.getPath("userData"),
        "runs",
        testid,
        `${testid}.fqd`
      );
      const configPath = path.resolve(
        app.getPath("userData"),
        "runs",
        testid,
        "config.json"
      );

      try {
        fs.mkdirSync(path.dirname(xmlPath), { recursive: true });
        fs.writeFileSync(xmlPath, xmlContent);
        fs.writeFileSync(configPath, JSON.stringify(settings));
      } catch (error: any) {
        console.error(error);
        logger(`startLineGene error: ${error.message}`, "logErrors");
      }

      const launchParam = `${xmlPath} ${outputPath}`;

      spawn("cmd", ["/c", `start ${pcrServerPath}`]);
      spawn("cmd.exe", [
        "/c",
        `start ${lineGenePath?.replace(
          "LineGene1600 for research",
          '"LineGene1600 for research"'
        )} /run ${launchParam}`,
      ]);

      focusInterval = setInterval(() => {
        if (mainWindow) mainWindow.focus();
      }, 1000);

      return true;
    }
  );
}

export function endTest(/* parameters */): void {
  /**
   * Stop the test and kill LineGene
   * @returns {Boolean} true if test stopped
   * */
  ipcMain.handle("endLineGene", async (_event: Electron.IpcMainInvokeEvent) => {
    try {
      ["Gene-9660.exe", "LineGene1600.exe", "PcrServer.exe"].forEach(
        killProcess
      );
      clearInterval(focusInterval);
      return true;
    } catch (error: any) {
      console.error(error);
      logger(`endLineGene error: ${error.message}`, "logErrors");
      return false;
    }
  });
}

export function getUnsubmitted() {
  /**
   * bGet unsubmitted tests
   * @returns {Array} unsubmitted tests
   * */
  ipcMain.handle("getUnsubmitted", (_event: Electron.IpcMainInvokeEvent) => {
    const filePath = path.resolve(app.getPath("userData"), "runs");
    try {
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
      }
      let getDirectories = fs
        .readdirSync(filePath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      const unsubmittedTests = getDirectories
        .filter((testid) => {
          if (testid === "demo") {
            return false;
          }
          const resultPath = path.resolve(
            app.getPath("userData"),
            "runs",
            testid,
            testid + ".csv"
          );
          try {
            fs.accessSync(resultPath, fs.constants.F_OK);
            return true;
          } catch (err) {
            return false;
          }
        })
        .map((testid) => {
          const resultFilePath = path.resolve(
            app.getPath("userData"),
            "runs",
            testid,
            testid + ".csv"
          );
          const launchFilePath = path.resolve(
            app.getPath("userData"),
            "runs",
            testid,
            "lineGeneSetup.xml"
          );
          let testStarted;
          try {
            testStarted = fs.statSync(launchFilePath).ctime;
          } catch (error) {
            testStarted = "xml not found";
          }
          const testFinished = fs.statSync(resultFilePath).ctime;
          const testObject = { testid, testStarted, testFinished };
          return testObject;
        });
      return unsubmittedTests;
    } catch (err) {
      console.error(err);
      return false;
    }
  });
}

export function getTests() {
  /**
   * Get test results
   * */
  ipcMain.handle(
    "getTests",
    (_event: Electron.IpcMainInvokeEvent): ITestObject[] | boolean => {
      const filePath = path.resolve(app.getPath("userData"), "runs");
      try {
        //Get Unsubmitted
        let getDirectories = fs
          .readdirSync(filePath, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);

        const unsubmittedTests = getDirectories
          .filter((testid) => {
            if (testid === "demo") {
              return false;
            }
            const resultPath = path.resolve(
              app.getPath("userData"),
              "runs",
              testid,
              testid + ".csv"
            );
            try {
              fs.accessSync(resultPath, fs.constants.F_OK);
              return true;
            } catch (err) {
              return false;
            }
          })
          .map((testid) => {
            const resultDirectory = path.resolve(
              app.getPath("userData"),
              "runs",
              testid
            );
            const resultFilePath = path.resolve(
              resultDirectory,
              testid + ".csv"
            );
            const launchFilePath = path.resolve(
              resultDirectory,
              "lineGeneSetup.xml"
            );
            const configFilePath = path.resolve(resultDirectory, "config.json");
            let testStarted;
            let testStartedMS;
            let testmethod;
            try {
              testStarted = fs.statSync(launchFilePath).mtime;
              testStartedMS = fs.statSync(launchFilePath).mtimeMs;
            } catch (error) {
              testStarted = "xml not found";
            }
            const testFinished = fs.statSync(resultFilePath).mtime;
            const testFinishedMS = fs.statSync(resultFilePath).mtimeMs;
            try {
              testmethod = JSON.parse(
                fs.readFileSync(configFilePath, "utf8")
              ).testmethod;
            } catch (error) {
              testmethod = null;
            }

            const testObject = {
              testid,
              testStarted,
              testStartedMS,
              testFinished,
              testFinishedMS,
              resultDirectory,
              submitted: false,
              testmethod,
            };
            return testObject;
          });

        //Check if "done" directory exists
        try {
          fs.accessSync(path.resolve(filePath, "done"), fs.constants.F_OK);
        } catch (error) {
          console.error('no "done" directory found');
          logger(`no "done" directory found`, "logErrors");
          return unsubmittedTests as ITestObject[];
        }

        //Get Submitted
        getDirectories = fs
          .readdirSync(path.resolve(filePath, "done"), {
            withFileTypes: true,
          })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);

        const submittedTests = getDirectories
          .filter((testid) => {
            if (testid === "demo") {
              return false;
            }
            const resultPath = path.resolve(
              app.getPath("userData"),
              "runs",
              "done",
              testid,
              testid + ".csv"
            );
            try {
              fs.accessSync(resultPath, fs.constants.F_OK);
              return true;
            } catch (err) {
              return false;
            }
          })
          .map((testid) => {
            const resultDirectory = path.resolve(
              app.getPath("userData"),
              "runs",
              "done",
              testid
            );
            const resultFilePath = path.resolve(
              resultDirectory,
              testid + ".csv"
            );
            const launchFilePath = path.resolve(
              resultDirectory,
              "lineGeneSetup.xml"
            );
            const configFilePath = path.resolve(resultDirectory, "config.json");
            let testStartedMS;
            let testStarted;
            let testmethod;
            try {
              testStarted = fs.statSync(launchFilePath).mtime;
              testStartedMS = fs.statSync(launchFilePath).mtimeMs;
            } catch (error) {
              testStarted = "xml not found";
            }
            const testFinished = fs.statSync(resultFilePath).mtime;
            const testFinishedMS = fs.statSync(resultFilePath).mtimeMs;
            try {
              testmethod = JSON.parse(
                fs.readFileSync(configFilePath, "utf8")
              ).testmethod;
            } catch (error) {
              testmethod = null;
            }
            const testObject = {
              testid,
              testStarted,
              testStartedMS,
              testFinished,
              testFinishedMS,
              resultDirectory,
              submitted: true,
              testmethod,
            };
            return testObject;
          });

        return unsubmittedTests.concat(submittedTests).sort((a, b) => {
          if (a.testStartedMS === undefined || b.testStartedMS === undefined) {
            return 0;
          }
          return b.testStartedMS - a.testStartedMS;
        }) as ITestObject[];
      } catch (err: any) {
        console.error(err);
        logger(err, "logErrors");
        return false;
      }
    }
  );
}

export function editResultsHandler() {
  /** Edit test results */
  ipcMain.handle("editResults", async (_event, testid, results) => {
    try {
      let destPath = path.resolve(
        app.getPath("userData"),
        "runs",
        testid,
        "override.json"
      );
      if (
        !fs.existsSync(destPath) &&
        !fs.existsSync(path.resolve(app.getPath("userData"), "runs", testid))
      ) {
        destPath = path.resolve(
          app.getPath("userData"),
          "runs",
          "done",
          testid,
          "override.json"
        );
        if (!fs.existsSync(destPath)) {
          fs.writeFileSync(destPath, JSON.stringify([]));
        }
      } else if (
        fs.existsSync(path.resolve(app.getPath("userData"), "runs", testid))
      ) {
        destPath = path.resolve(
          app.getPath("userData"),
          "runs",
          testid,
          "override.json"
        );
        if (!fs.existsSync(destPath)) {
          if (!fs.existsSync(destPath)) {
            fs.writeFileSync(destPath, JSON.stringify([]));
          }
        }
      }
      const lastResults = JSON.parse(fs.readFileSync(destPath, "utf8"));
      const newResults = { ...lastResults, ...results };
      fs.writeFileSync(destPath, JSON.stringify(newResults));
    } catch (err) {
      console.error(err);
    }
    return true;
  });
}
