import { IpcMainInvokeEvent } from 'electron';
import { IDevice, IFile } from '../interfaces/interfaces';
import * as DeviceUtils from './deviceUtils';
// Modules to control application life and create native browser window
const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');
const macaddress = require('macaddress');
const { spawn } = require('./spawn');
const { logger } = require('./logger');

/**
 * @returns {boolean}
 * @description Moves a test from the "runs" directory to the "done" directory
 */
export const ipcMainMoveFiles = () => {
  ipcMain.handle('moveFiles', (event: IpcMainInvokeEvent, testid: string) => {
    if (testid !== 'demo') {
      const sourcePath = path.resolve(app.getPath('userData'), 'runs', testid);
      const destPath = path.resolve(app.getPath('userData'), 'runs', 'done', testid);
      try {
        fs.mkdirSync(destPath, { recursive: true });
        fs.readdirSync(sourcePath).forEach((file: IFile) => {
          fs.renameSync(path.resolve(sourcePath, file), path.resolve(destPath, file));
        });
        fs.rmdirSync(sourcePath);
      } catch (err) {
        return err;
      }
    }
    return true;
  });
};

/**
 * Save to USB
 */
export const ipcMainSaveToUSB = () => {
  ipcMain.handle('saveToUSB', (event: IpcMainInvokeEvent, testid: string, results: string[]) => {
    console.log(results);
    logger(JSON.stringify(results), 'logInfos.txt');
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + '-' + time;

    const filename = testid + '.csv';
    const destPath = 'D:\\nu-dx-pcr\\runs';
    const filepath = path.resolve(destPath, filename);
    try {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.writeFileSync(filepath, results);
    } catch (err) {
      console.log(err);
      logger(err, 'logErrors.txt');
      logger(`saveToUSB: ${err}`, 'logErrors.txt');
      throw err;
    }
    return true;
  });
};

/**
 * Get Device Infos
 * @returns {object}  { hardwareId, deviceType, serialNumber }
 * */
export const ipcMainGetDeviceInfo = () => {
  ipcMain.handle('getDeviceInfo', async (event: IpcMainInvokeEvent) => {
    try {
      let hardwareId = await macaddress.one().then((mac: IDevice) => mac);
      let serialNumber = ''; //await getSerialNumber();
      let deviceType = DeviceUtils.getDeviceType();
      return { hardwareId, deviceType, serialNumber };
    } catch (err) {
      console.log(err);
      logger(err, 'logErrors.txt');
      logger(`getDeviceInfo: ${err}`, 'logErrors.txt');
      throw err;
    }
  });
};

/**
 * Provide App Version
 * @returns {string}  version
 * */
export const ipcMainGetVersion = () => {
  ipcMain.handle('getVersion', (event: IpcMainInvokeEvent) => {
    return app.getVersion();
  });
};

/**
 * Exit App
 * */
export const ipcMainExit = () => {
  ipcMain.handle('exit', (event: IpcMainInvokeEvent) => {
    spawn('taskkill', ['/f', '/im', 'LineGene1600.exe']);
    spawn('taskkill', ['/f', '/im', 'Gene-9660.exe']);
    spawn('taskkill', ['/f', '/im', 'PcrServer.exe']);
    app.quit();
  });
};

/**
 * Log Errors or Infos
 * */
export const ipcMainLogEvents = () => {
  ipcMain.handle('log-Events', (event: IpcMainInvokeEvent, message: string, logName: string) =>
    logger(message, logName)
  );
};

export const ipcMainLaunchUpdates = () => {
  ipcMain.handle('launch-updates', (event: IpcMainInvokeEvent) => updater());
};
function updater() {
  throw new Error('Function not implemented.');
}

/**
 * Download the latest version of the app
 * @returns {void}
 * */
export const ipcMainDownloadApp = () => {
  ipcMain.handle('downloadApp', async (event: IpcMainInvokeEvent) => {
    autoUpdater.checkForUpdates();
    autoUpdater.downloadUpdate();
  });
};

/**
 * Edit test results
 * */
export const ipcMainEditResults = () => {
  ipcMain.handle('editResults', async (event: IpcMainInvokeEvent, testid: string, results: string[]) => {
    try {
      let destPath = path.resolve(app.getPath('userData'), 'runs', testid, 'override.json');
      if (!fs.existsSync(destPath) && !fs.existsSync(path.resolve(app.getPath('userData'), 'runs', testid))) {
        destPath = path.resolve(app.getPath('userData'), 'runs', 'done', testid, 'override.json');
        if (!fs.existsSync(destPath)) {
          fs.writeFileSync(destPath, JSON.stringify([]));
        }
      } else if (fs.existsSync(path.resolve(app.getPath('userData'), 'runs', testid))) {
        destPath = path.resolve(app.getPath('userData'), 'runs', testid, 'override.json');
        if (!fs.existsSync(destPath)) {
          if (!fs.existsSync(destPath)) {
            fs.writeFileSync(destPath, JSON.stringify([]));
          }
        }
      }
      const lastResults = JSON.parse(fs.readFileSync(destPath, 'utf8'));
      const newResults = { ...lastResults, ...results };
      fs.writeFileSync(destPath, JSON.stringify(newResults));
    } catch (err) {
      console.log(err);
    }
    return true;
  });
};
