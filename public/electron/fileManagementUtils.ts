import { IpcMainEvent } from 'electron';

const { app, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { logger } = require('./logger');
const macaddress = require('macaddress');
const { getDeviceType } = require('./deviceUtils');
const { store } = require('./constants');

/**
 * check if result file is present and move to run directory
 */
const ipcMainResult = () => {
  ipcMain.on('checkResultFile', (event: IpcMainEvent, testid: string) => {
    if (testid === 'demo') {
      event.returnValue = true;
      return;
    }

    const filepath = path.resolve(os.homedir(), 'Documents', `${testid}.csv`);
    const destDir = path.resolve(app.getPath('userData'), 'runs', testid);
    const destpath = path.resolve(destDir, `${testid}.csv`);

    try {
      fs.accessSync(filepath, fs.constants.F_OK);
    } catch (error: any) {
      const errorMsg = `Result file "${filepath}" is not present or not readable: ${error.message}`;
      console.error(errorMsg);
      logger(errorMsg, 'logErrors.txt');
      event.returnValue = false;
      return;
    }

    try {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      event.returnValue = true;
    } catch (error: any) {
      const errorMsg = `Result file "${filepath}" could not be moved to "${destpath}" due to error: ${error.message}`;
      console.error(errorMsg);
      logger(errorMsg, 'logErrors.txt');
      event.returnValue = false;
    }
  });
};

/**
 * move resultfile to run directory
 */
const ipcMainOnResultfile = () => {
  ipcMain.on('moveResultFile', (event: IpcMainEvent, testid: string) => {
    if (testid === 'demo') {
      event.returnValue = true;
      return;
    }

    const filepath = path.resolve(os.homedir(), 'Documents', `${testid}.csv`);
    const destpath = path.resolve(app.getPath('userData'), 'runs', testid, testid + '.csv');

    try {
      fs.renameSync(filepath, destpath);
      const successMsg = `Result file successfully moved to "${destpath}"`;
      console.log(successMsg);
      logger(successMsg, 'logErrors.txt');
      event.returnValue = true;
    } catch (error: any) {
      const errorMsg = `Result file "${filepath}" could not be moved to "${destpath}" due to error: ${error.message}`;
      console.error(errorMsg);
      logger(errorMsg, 'logErrors.txt');
      event.returnValue = false;
    }
  });
};

const ipcMainConfig = () => {
  ipcMain.on('getConfig', async (event: IpcMainEvent) => {
    let settings = store.get('settings');
    let wellCount = getDeviceType();
    settings.isDev = isDev;
    settings.version = app.getVersion();
    let hardwareId = await macaddress.one().then((mac: any) => mac);
    let serialNumber = '';
    settings.device = { hardwareId, wellCount, serialNumber };
    event.returnValue = settings;
  });
};

/**
 * fetch config from config.json and hardware
 */
const ipcMainGetConfig = () => {
  ipcMain.on('getConfig', async (event: IpcMainEvent) => {
    let settings = store.get('settings');
    let wellCount = getDeviceType();
    settings.isDev = isDev;
    settings.version = app.getVersion();
    let hardwareId = await macaddress.one().then((mac: any) => mac);
    let serialNumber = '';
    settings.device = { hardwareId, wellCount, serialNumber };
    event.returnValue = settings;
  });
};

module.exports = {
  ipcMainResult,
  ipcMainOnResultfile,
  ipcMainConfig,
  ipcMainGetConfig,
};
