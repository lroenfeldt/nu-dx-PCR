const { app, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { logger } = require('./logger');
const macaddress = require('macaddress');
import { IpcMainEvent } from 'electron';
import { IDevice } from '../interfaces/interfaces';
import * as DeviceUtils from './deviceUtils';
import * as Constants from './constants';

/**
 * check if result file is present and move to run directory
 */
export const ipcMainResult = () => {
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
    } catch (error) {
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
    } catch (error) {
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
export const ipcMainOnResultfile = () => {
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
    } catch (error) {
      const errorMsg = `Result file "${filepath}" could not be moved to "${destpath}" due to error: ${error.message}`;
      console.error(errorMsg);
      logger(errorMsg, 'logErrors.txt');
      event.returnValue = false;
    }
  });
};

export const ipcMainConfig = () => {
  ipcMain.on('getConfig', async (event: IpcMainEvent) => {
    let settings = Constants.store.get('settings');
    let wellCount = DeviceUtils.getDeviceType();
    settings.isDev = isDev;
    settings.version = app.getVersion();
    let hardwareId = await macaddress.one().then((mac: IDevice) => mac);
    let serialNumber = ''; // await getSerialNumber();
    settings.device = { hardwareId, wellCount, serialNumber };
    event.returnValue = settings;
  });
};

/**
 * fetch config from config.json and hardware
 */
export const ipcMainGetConfig = () => {
  ipcMain.on('getConfig', async (event: IpcMainEvent) => {
    let settings = Constants.store.get('settings');
    let wellCount = DeviceUtils.getDeviceType();
    settings.isDev = isDev;
    settings.version = app.getVersion();
    let hardwareId = await macaddress.one().then((mac: IDevice) => mac);
    let serialNumber = '';
    settings.device = { hardwareId, wellCount, serialNumber };
    event.returnValue = settings;
  });
};
