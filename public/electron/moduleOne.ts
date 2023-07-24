import { ISoftwareList, IStore } from '../interfaces/interfaces';
const fs = require('fs');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Store = require('electron-store');

/**
 * Default configuration
 *  @type {string}
 */

export const store: IStore = new Store({
  defaults: {
    settings: {
      account: {
        initialized: false,
        authToken: '',
        maxBarcodeLength: 10,
        minBarcodeLength: 9,
        allowedCharacters: '1234567890',
        orderKey: 'A210176',
        autoControl: true,
        hecThreshFL: 100,
        virusThreshFL: 300,
        checkBarcodesDB: true,
        checkOrder: true,
        submitRunSetup: true,
        showResults: false,
        submitResults: true,
        autoSubmitUnsubmitted: false,
        customCheckBarcodesEndpoint: '',
        customSubmitRunSetupEndpoint: '',
        customSubmitAutoControlEndpoint: '',
        customFetchAutoControlEndpoint: '',
        customSubmitResultsEndpoint: '',
        data: {
          id: 'fbdaac7d-4055-4b30-9f64-d0070447eca7',
          profileId: 'cef5b173-f8dc-494e-8ce0-62938441ae01',
          name: 'nu:dx PCR',
          email: 'l.roenfeldt@procomcure.de',
          lastSignIn: '2022-06-03T08:52:07.302061Z',
          authenticated: true,
          contactPerson: 'Leif Rönfeldt',
          address: 'tbd',
          emailConfirmedAt: '2022-05-23T10:03:44.944231Z',
          role: {
            name: 'poc-customer',
            isAdmin: true,
          },
        },
      },
      user: {
        tpcPos: 'A01',
        ntcPos: 'A02',
        locale: 'en',
        updateType: 'stable',
      },
    },
  },
});

export let mainWindow: {
  on: (arg0: string, arg1: { (): void; (): void }) => void;
  focus: () => void;
  once: (arg0: string, arg1: () => void) => void;
  setMenuBarVisibility: (arg0: string) => void;
  show: () => void;
  loadURL: (arg0: string) => void;
  webContents: { setDevToolsWebContents: (arg0: string) => void; openDevTools: (arg0: { mode: string }) => void };
};

export let splash: {
  webContents: { send: (arg0: string, arg1: string) => void; openDevTools: (arg0: { mode: string }) => void };
  hide: () => void;
  loadFile: (arg0: string) => void;
  center: () => void;
};

export let lineGenePath: string = '';

export const killProcess = (process: string | Object) => {
  spawn('taskkill', ['/f', '/im', process]);
};
export const forceConsole: boolean = false;
/**
 * check installed version of LineGene
 * @returns {string} the version of LineGene
 */
export const softwareList: ISoftwareList[] = [
  {
    path: 'C:\\Bioer\\LineGene\\1600\\bin\\LineGene1600.exe',
    returnType: '16',
    name: 'LineGene1600',
  },
  {
    path: 'C:\\Bioer\\LineGene1600 for research\\1644\\bin\\LineGene1600.exe',
    returnType: '16',
    name: 'LineGene1644',
  },
  {
    path: 'C:\\BIOER\\LineGene1600 for research\\1640\\bin\\LineGene1600.exe',
    returnType: '16',
    name: 'LineGene1640',
  },
  {
    path: 'C:\\BIOER\\96\\bin\\Gene-9660.exe',
    returnType: '96',
    name: 'LineGene9600',
  },
];

export function spawn(arg0: string, arg1: (string | Object)[]) {
  throw new Error('Function not implemented.');
}

// Function getDeviceType
export const getDeviceType = () => {
  for (let i = 0; i < softwareList.length; i++) {
    const software = softwareList[i];
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

// Function createWindow
export function createWindow() {
  mainWindow = new BrowserWindow({
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
      splash.webContents.send('updateStatus', 'launching in development mode...');
      setTimeout(function () {
        splash.hide();
        mainWindow.show();
      }, 5000);
    }
  });

  mainWindow.on('closed', () => {
    ['Gene-9660.exe', 'LineGene1600.exe', 'PcrServer.exe'].forEach(killProcess);
    app.quit();
  });

  // and load the index.html of the app.
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  // Open the DevTools.
  if (isDev || forceConsole) {
    const devtools = new BrowserWindow();
    mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
  // aktivate kiosk mode
  //mainWindow.setKiosk(true);
}

// Function createSplash()
export function createSplash() {
  // Create splash Screen
  splash = new BrowserWindow({
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
  if (isDev || forceConsole) {
    splash.webContents.openDevTools({ mode: 'detach' });
  }
}
