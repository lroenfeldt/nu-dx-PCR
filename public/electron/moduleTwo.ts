const { app, BrowserWindow, ipcMain } = require('electron');
const AutoLaunch = require('auto-launch');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { logger } = require('./logger');
const macaddress = require('macaddress');
import { IDevice } from '../interfaces/interfaces';
import * as Module from './moduleOne';
import { spawn } from './moduleOne';

export const whenReady = () => {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    Module.createSplash();
    Module.createWindow();
    spawn('taskkill', ['/f', '/im', 'PcrServer.exe']);

    //Launch app on startup
    let autoLaunch = new AutoLaunch({
      name: 'nu:dx PCR',
      path: app.getPath('exe'),
    });
    autoLaunch.isEnabled().then((isEnabled: boolean) => {
      if (!isEnabled && !isDev) autoLaunch.enable();
    });

    updater();
    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) Module.createWindow();
    });
  });

  function updater() {
    throw new Error('Function not implemented.');
  }
};

export const on = () => {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    ['Gene-9660.exe', 'LineGene1600.exe', 'PcrServer.exe'].forEach(Module.killProcess);
    app.quit();
  });
};

export const ipcMainResult = () => {
  ipcMain.on('checkResultFile', (event: Event, testid: string) => {
    // Explanation event parameter type
    // The type of the event parameter in an Electron function depends on which function referred to.
    // in general,`Electron.Event` type.
    // use the `Electron.IpcMainEvent` a subclass of `Electron.Event`
    // used for communication between the main process and renderer processes
    // `ipcMain` module to listen for the `my-event` event being emitted from the renderer process.
    // When the event is received, the function is called with the `event` parameter of type `IpcMainEvent`.
    // can replace `IpcMainEvent` with `Event` if using the `BrowserWindow` or `WebContents` APIs to listen to events.
    // In TypeScript, when using a type annotation for an event parameter, use `typeof IpcMainEvent`
    // helps to reference the type of `IpcMainEvent` correctly.

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

export const ipcMainOnResultfile = () => {
  ipcMain.on('moveResultFile', (event: Event, testid: string) => {
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
  ipcMain.on('getConfig', async (event: Event) => {
    let settings = Module.store.get('settings');
    let wellCount = Module.getDeviceType();
    settings.isDev = isDev;
    settings.version = app.getVersion();
    let hardwareId = await macaddress.one().then((mac: IDevice) => mac);
    let serialNumber = ''; // await getSerialNumber();
    settings.device = { hardwareId, wellCount, serialNumber };
    event.returnValue = settings;
  });
};

export const ipcMainGetConfig = () => {
  // fetch config from config.json and hardware
  ipcMain.on('getConfig', async (event: Event) => {
    let settings = Module.store.get('settings');
    let wellCount = Module.getDeviceType();
    settings.isDev = isDev;
    settings.version = app.getVersion();
    let hardwareId = await macaddress.one().then((mac: IDevice) => mac);
    let serialNumber = ''; // await getSerialNumber();
    settings.device = { hardwareId, wellCount, serialNumber };
    event.returnValue = settings;
  });
};
