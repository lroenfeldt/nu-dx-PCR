const fs = require('fs');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const AutoLaunch = require('auto-launch');
import * as Constants from './constants';
import { spawn } from './constants';

let lineGenePath: string = '';

/**
 *  Function getDeviceType
@returns boolean
 **/
export const getDeviceType = () => {
  for (let i = 0; i < Constants.softwareList.length; i++) {
    const software = Constants.softwareList[i];
    try {
      const res = fs.realpathSync(software.path);
      fs.accessSync(res, fs.constants.F_OK);
      lineGenePath = res;

      return software.returnType;
    } catch (error) {
      console.log(`${software.name} not found`);
      logger(`${software.name} not found`, 'logInfos.txt');
    }
  }
  const errMessage = 'No LineGene Installation found';
  console.log(errMessage);
  logger(errMessage, 'logInfos.txt');
  return false;
};

function logger(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}

/**
 * Function createWindow
 * Create and configure the browser window.
 * */
export function createWindow() {
  let mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    resizable: isDev,
    fullscreen: !isDev,
    alwaysOnTop: false, // !isDev
    backgroundColor: '#000000',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      webSecurity: false,
      contextIsolation: true,
    },
  });

  mainWindow.on('show', () => {
    setTimeout(() => {
      mainWindow.focus();
    }, 200);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.setMenuBarVisibility(isDev);

    if (isDev) {
      Constants.splash.webContents.send('updateStatus', 'launching in development mode...');
      setTimeout(function () {
        Constants.splash.hide();
        mainWindow.show();
      }, 5000);
    }
  });

  mainWindow.on('closed', () => {
    ['Gene-9660.exe', 'LineGene1600.exe', 'PcrServer.exe'].forEach(Constants.killProcess);
    app.quit();
  });

  // and load the index.html of the app.
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  // Open the DevTools.
  if (isDev || Constants.forceConsole) {
    const devtools = new BrowserWindow();
    mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
  // aktivate kiosk mode
  //mainWindow.setKiosk(true);
}

/**
 * Function createSplash()
 * Create and configure the splash window.
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
export function createSplash() {
  // Create splash Screen
  let splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      webSecurity: false,
      contextIsolation: true,
    },
  });
  splash.loadFile(path.join(__dirname, 'splash.html'));
  splash.center();

  // Open the DevTools.
  if (isDev || Constants.forceConsole) {
    splash.webContents.openDevTools({ mode: 'detach' });
  }
}

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
export const whenReady = () => {
  app.whenReady().then(() => {
    createSplash();
    createWindow();
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
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
  function updater() {
    throw new Error('Function not implemented.');
  }
};

/**
 * Quit when all windows are closed, except on macOS. There, it's common
 * for applications and their menu bar to stay active until the user quits
 * explicitly with Cmd + Q.
 */
export const on = () => {
  app.on('window-all-closed', () => {
    ['Gene-9660.exe', 'LineGene1600.exe', 'PcrServer.exe'].forEach(Constants.killProcess);
    app.quit();
  });
};
