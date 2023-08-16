const fs = require('fs');
const path = require('path');
const { app, ipcMain } = require('electron');
const { store } = require('./constants');
import { IpcMainInvokeEvent } from 'electron';

/**
 * archive run folder
 */
const ipcMainArchiveRun = () => {
  ipcMain.handle('archiveRun', async () => {
    const userDataPath = app.getPath('userData');
    const filepath = path.join(userDataPath, 'runs');
    const destpath = path.join(userDataPath, 'archive');

    try {
      if (!fs.existsSync(destpath)) {
        fs.mkdirSync(destpath);
      }
      if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
      }

      const files = fs.readdirSync(filepath, { withFileTypes: true });

      for (let file of files) {
        if (file.isDirectory() && file.name !== 'demo') {
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
};

/**
 * save config to config.json
 */
const ipcMainSaveConfig = () => {
  ipcMain.handle('saveConfig', async (event: IpcMainInvokeEvent, config: Object) => {
    try {
      store.set('settings', config);
      return true;
    } catch (err) {
      console.log(err);
      logger(`saveConfig ${err}`, 'logErrors.txt');
      throw Error('Settings could not be saved');
    }
  });
  //reset config.json to defaults
  ipcMain.handle('clearConfig', async (event: IpcMainInvokeEvent) => {
    try {
      store.clear();
      return true;
    } catch (err) {
      console.log(err);
      logger(`clearConfig ${err}`, 'logErrors.txt');
      throw Error('Settings could not be saved');
    }
  });
};
function logger(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}

/**
 * save config to config.json
 */
const ipcMainConfigs = () => {
  ipcMain.handle('saveConfig', async (event: IpcMainInvokeEvent, config: Object) => {
    try {
      store.set('settings', config);
      return true;
    } catch (err) {
      console.log(err);
      logger(`saveConfig ${err}`, 'logErrors.txt');
      throw Error('Settings could not be saved');
    }
  });
};

/**
 * reset config.json to defaults
 */
const ipcMainClearConfig = () => {
  ipcMain.handle('clearConfig', async (event: IpcMainInvokeEvent) => {
    try {
      store.clear();
      return true;
    } catch (err) {
      console.log(err);
      logger(`clearConfig ${err}`, 'logErrors.txt');
      throw Error('Settings could not be saved');
    }
  });
};

/**
 * Get result file from run directory
 * @returns {object} {resultFile, configFile, testStarted}
 */
const ipcMainGetResult = () => {
  ipcMain.handle('getResult', async (event: IpcMainInvokeEvent, testid: string, done: boolean) => {
    logger(`getResult ${testid}`, 'logInfos.txt');
    let filepath: string;
    let configPath: string;
    let launchFilePath: string;
    let override = false;
    if (done && testid !== 'demo') {
      filepath = path.resolve(app.getPath('userData'), 'runs', 'done', testid, testid + '.csv');
      configPath = path.resolve(app.getPath('userData'), 'runs', 'done', testid, 'config.json');
      launchFilePath = path.resolve(app.getPath('userData'), 'runs', 'done', testid, 'lineGeneSetup.xml');
      override = fs.existsSync(path.resolve(app.getPath('userData'), 'runs', 'done', testid, 'override.json'))
        ? fs.readFileSync(path.resolve(app.getPath('userData'), 'runs', 'done', testid, 'override.json'), 'utf-8')
        : false;
    } else {
      filepath = path.resolve(app.getPath('userData'), 'runs', testid, testid + '.csv');
      configPath = path.resolve(app.getPath('userData'), 'runs', testid, 'config.json');
      launchFilePath = path.resolve(app.getPath('userData'), 'runs', testid, 'lineGeneSetup.xml');
      override = fs.existsSync(path.resolve(app.getPath('userData'), 'runs', testid, 'override.json'))
        ? fs.readFileSync(path.resolve(app.getPath('userData'), 'runs', testid, 'override.json'), 'utf-8')
        : false;
    }
    let resultFile = {};
    let configFile = {};
    let testStarted: number;

    try {
      testStarted = fs.statSync(launchFilePath).mtime;
    } catch (error) {
      console.log('test launch file not found, defaulting to current time for test start');
      logger(`test launch file not found, defaulting to current time for test start`, 'logInfos.txt');
      testStarted = Date.now();
    }

    try {
      resultFile = fs.readFileSync(filepath, 'utf-8');
    } catch (error: any) {
      console.log('error accessing result file for test' + testid);
      console.log(error);
      logger(`error accessing result file for test ${testid}`, 'logErrors.txt');
      logger(error, 'logErrors.txt');
      throw error;
    }
    try {
      configFile = fs.readFileSync(configPath, 'utf-8');
    } catch (error: any) {
      console.log('error accessing config file for test' + testid);
      console.log(error);
      logger(error, 'logErrors.txt');
    }
    return { resultFile, configFile, testStarted, override };
  });
};

module.exports = {
  ipcMainArchiveRun,
  ipcMainSaveConfig,
  ipcMainConfigs,
  ipcMainClearConfig,
  ipcMainGetResult,
};
