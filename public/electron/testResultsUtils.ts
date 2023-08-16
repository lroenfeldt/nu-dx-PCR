import { IpcMainInvokeEvent } from 'electron';
import { Dirent } from 'fs';
const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { logger } = require('./logger');

/**
 * Get unsubmitted tests
 * */
const ipcMainGetUnsubmitted = () => {
  ipcMain.handle('getUnsubmitted', (event: IpcMainInvokeEvent) => {
    const filePath = path.resolve(app.getPath('userData'), 'runs');
    try {
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
      }
      let getDirectories = fs
        .readdirSync(filePath, { withFileTypes: true })
        .filter((dirent: Dirent) => dirent.isDirectory())
        .map((dirent: Dirent) => dirent.name);

      const unsubmittedTests = getDirectories
        .filter((testid: string) => {
          if (testid === 'demo') {
            return false;
          }
          const resultPath = path.resolve(app.getPath('userData'), 'runs', testid, testid + '.csv');
          try {
            fs.accessSync(resultPath, fs.constants.F_OK);
            return true;
          } catch (err) {
            return false;
          }
        })
        .map((testid: string) => {
          const resultFilePath = path.resolve(app.getPath('userData'), 'runs', testid, testid + '.csv');
          const launchFilePath = path.resolve(app.getPath('userData'), 'runs', testid, 'lineGeneSetup.xml');
          let testStarted: string | Date;
          // Based on the code, if the `testStarted` value is successfully obtained from `fs.statSync(launchFilePath).ctime`,
          // it will be a `Date` object representing the creation time of the file.
          // If an error occurs and the `catch` block is executed, the `testStarted` value will be assigned the string value `'xml not found'`.
          try {
            testStarted = fs.statSync(launchFilePath).ctime;
          } catch (error) {
            testStarted = 'xml not found';
          }
          const testFinished = fs.statSync(resultFilePath).ctime;
          const testObject = { testid, testStarted, testFinished };
          return testObject;
        });
      return unsubmittedTests;
    } catch (err) {
      console.log(err);
      return false;
    }
  });
};

/**
 * Get test results
 * */
const ipcMainGetTest = () => {
  ipcMain.handle('getTests', (event: IpcMainInvokeEvent) => {
    const filePath = path.resolve(app.getPath('userData'), 'runs');
    try {
      //Get Unsubmitted
      let getDirectories = fs
        .readdirSync(filePath, { withFileTypes: true })
        .filter((dirent: Dirent) => dirent.isDirectory())
        .map((dirent: Dirent) => dirent.name);

      const unsubmittedTests = getDirectories
        .filter((testid: string) => {
          if (testid === 'demo') {
            return false;
          }
          const resultPath = path.resolve(app.getPath('userData'), 'runs', testid, testid + '.csv');
          try {
            fs.accessSync(resultPath, fs.constants.F_OK);
            return true;
          } catch (err) {
            return false;
          }
        })
        .map((testid: string) => {
          const resultDirectory = path.resolve(app.getPath('userData'), 'runs', testid);
          const resultFilePath = path.resolve(resultDirectory, testid + '.csv');
          const launchFilePath = path.resolve(resultDirectory, 'lineGeneSetup.xml');
          const configFilePath = path.resolve(resultDirectory, 'config.json');
          let testStarted: string | Date;
          let testStartedMS: number | undefined;
          let testmethod: Object | null;
          // Within the `try` block, the `testStartedMS` variable is assigned the value of `fs.statSync(launchFilePath).mtimeMs`,
          // which is the millisecond representation of the modification time of the file.
          // In this case, it will be a `number`.
          // If an error occurs and the `catch` block is executed, the `testStartedMS` variable will not be assigned a value.
          // In this case, its type will be implicitly `undefined`.
          try {
            testStarted = fs.statSync(launchFilePath).mtime;
            testStartedMS = fs.statSync(launchFilePath).mtimeMs;
          } catch (error) {
            testStarted = 'xml not found';
          }
          const testFinished = fs.statSync(resultFilePath).mtime;
          const testFinishedMS = fs.statSync(resultFilePath).mtimeMs;
          try {
            testmethod = JSON.parse(fs.readFileSync(configFilePath)).testmethod;
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
        fs.accessSync(path.resolve(filePath, 'done'), fs.constants.F_OK);
      } catch (error) {
        console.log('no "done" directory found');
        logger(`no "done" directory found`, 'logErrors.txt');
        return unsubmittedTests;
      }

      //Get Submitted
      getDirectories = fs
        .readdirSync(path.resolve(filePath, 'done'), {
          withFileTypes: true,
        })
        .filter((dirent: Dirent) => dirent.isDirectory())
        .map((dirent: Dirent) => dirent.name);

      const submittedTests = getDirectories
        .filter((testid: string) => {
          if (testid === 'demo') {
            return false;
          }
          const resultPath = path.resolve(app.getPath('userData'), 'runs', 'done', testid, testid + '.csv');
          try {
            fs.accessSync(resultPath, fs.constants.F_OK);
            return true;
          } catch (err) {
            return false;
          }
        })
        .map((testid: string) => {
          const resultDirectory = path.resolve(app.getPath('userData'), 'runs', 'done', testid);
          const resultFilePath = path.resolve(resultDirectory, testid + '.csv');
          const launchFilePath = path.resolve(resultDirectory, 'lineGeneSetup.xml');
          const configFilePath = path.resolve(resultDirectory, 'config.json');
          let testStartedMS: number | undefined;
          let testStarted: string | Date;
          let testmethod: Object | null;
          try {
            testStarted = fs.statSync(launchFilePath).mtime;
            testStartedMS = fs.statSync(launchFilePath).mtimeMs;
          } catch (error) {
            testStarted = 'xml not found';
          }
          const testFinished = fs.statSync(resultFilePath).mtime;
          const testFinishedMS = fs.statSync(resultFilePath).mtimeMs;
          try {
            testmethod = JSON.parse(fs.readFileSync(configFilePath)).testmethod;
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

      return unsubmittedTests
        .concat(submittedTests)
        .sort((a: { testStartedMS: number }, b: { testStartedMS: number }) => b.testStartedMS - a.testStartedMS);
    } catch (err) {
      console.log(err);
      logger(err, 'logErrors.txt');
      return false;
    }
  });
};

module.exports = {
  ipcMainGetUnsubmitted,
  ipcMainGetTest,
};
