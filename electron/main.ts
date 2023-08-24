
import { app, BrowserWindow, ipcMain,  } from 'electron';
import path from 'path';
import fs from 'fs';
import Store from 'electron-store';
import shutdown from 'electron-shutdown-command';
import isDev from 'electron-is-dev';
import { SerialPort } from 'serialport';
import { autoUpdater } from 'electron-updater';
import AutoLaunch from 'auto-launch';
import os from 'os';
import macaddress from 'macaddress';
import { spawn } from './spawn';
import { logger } from './logger';
import { IStore, IGetResultResponse, ILineGeneSettings, ITestObject } from './interfaces/interfaces';



let mainWindow: BrowserWindow | undefined;
let splash: BrowserWindow | undefined;
let lineGenePath: string;
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')
const killProcess = (process: string) => {
  spawn('taskkill', ['/f', '/im', process]);
};

const forceConsole: boolean = false;

/**
 * check installed version of LineGene
 * @returns {string} the version of LineGene
 */
const softwareList = [
  {
    path: 'C:\\Bioer\\LineGene\\1600\\bin\\LineGene1600.exe',
    returnType: 16,
    name: 'LineGene1600',
  },
  {
    path: 'C:\\Bioer\\LineGene1600 for research\\1644\\bin\\LineGene1600.exe',
    returnType: 16,
    name: 'LineGene1644',
  },
  {
    path: 'C:\\BIOER\\LineGene1600 for research\\1640\\bin\\LineGene1600.exe',
    returnType: 16,
    name: 'LineGene1640',
  },
  {
    path: 'C:\\BIOER\\96\\bin\\Gene-9660.exe',
    returnType: 96,
    name: 'LineGene9600',
  },
];
/**
 *
 * @returns number
 */
const getDeviceType = () => {
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

  return 0;
};

/**
 * Default configuration
 *  @type {string}
 */
const store = new Store<IStore>({
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

/**
 * Create and configure the browser window.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'nu:dx PCR',
    icon: path.join(process.env.PUBLIC, 'favicon.ico'),
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
      if(mainWindow)
      mainWindow.focus();
    }, 2000);
  });
  

  mainWindow.once('ready-to-show', () => {
    if(mainWindow)
      mainWindow.setMenuBarVisibility(isDev);

    if (isDev) {
      if(splash)
        splash.webContents.send('updateStatus', 'launching in development mode...');
      setTimeout(function () {
        if(splash && mainWindow){
          splash.hide();
          mainWindow.show();
        }
        
      }, 2000);
    
    }
  });

  mainWindow.on('closed', () => {
    ['Gene-9660.exe', 'LineGene1600.exe', 'PcrServer.exe'].forEach(killProcess);
    app.quit();
  });
  const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

 
  mainWindow.loadURL(isDev && VITE_DEV_SERVER_URL? VITE_DEV_SERVER_URL : path.join(process.env.DIST, 'index.html'));
  // Open the DevTools.
  if (isDev || forceConsole) {
    mainWindow.webContents.openDevTools({ mode: 'detach', activate: true,});
    
  
  }
}

/**
 * Create and configure the splash window.
 * */
function createSplash() {
  const splashConfig = {
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
  };


  splash = new BrowserWindow(splashConfig);

  // Load the splash content if the file exists.
  const splashFilePath =  path.join(__dirname, 'splash.html');

  if (fs.existsSync(splashFilePath)) {
    splash.loadFile(splashFilePath);
  } else {
    console.warn(`Splash file not found at path: ${splashFilePath}`);
  }

  splash.center();
}

app.whenReady().then(() => {
  createSplash();
  createWindow();
  
  spawn('taskkill', ['/f', '/im', 'PcrServer.exe']);

  //Launch app on startup
  let autoLaunch = new AutoLaunch({
    name: 'nu:dx PCR',
    path: app.getPath('exe'),
  });
  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled && !isDev) autoLaunch.enable();
  });

  updater();
  app.on('activate', function () {

    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  ['Gene-9660.exe', 'LineGene1600.exe', 'PcrServer.exe'].forEach(killProcess);
  app.quit();
});

/**check if result file is present and move to run directory*/
ipcMain.handle('checkResultFile', (event, testid) => {
  if (testid === 'demo') {
    return true;
  
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
    return false;
    return;
  }

  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    return true;
  } catch (error: any) {
    const errorMsg = `Result file "${filepath}" could not be moved to "${destpath}" due to error: ${error.message}`;
    console.error(errorMsg);
    logger(errorMsg, 'logErrors.txt');
    return false;
  }
});

/**move resultfile to run directory*/
ipcMain.handle('moveResultFile', (event, testid) => {
  if (testid === 'demo') {
    return true;
   
  }

  const filepath = path.resolve(os.homedir(), 'Documents', `${testid}.csv`);
  const destpath = path.resolve(app.getPath('userData'), 'runs', testid, testid + '.csv');

  try {
    fs.renameSync(filepath, destpath);
    const successMsg = `Result file successfully moved to "${destpath}"`;
    console.log(successMsg);
    logger(successMsg, 'logErrors.txt');
    return true;
  } catch (error:any) {
    const errorMsg = `Result file "${filepath}" could not be moved to "${destpath}" due to error: ${error.message}`;
    console.error(errorMsg);
    logger(errorMsg, 'logErrors.txt');
    return  false;
  }
});

const findAndMoveRunsDir = () => {
  let filepath = path.resolve(os.homedir(), 'Documents');
  let destpath = path.resolve(app.getPath('userData'));
  let files = fs.readdirSync(filepath, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isDirectory() && file.name == 'runs') {
      if (!fs.existsSync(path.resolve(destpath, file.name))) {
        fs.renameSync(path.resolve(filepath, file.name), path.resolve(destpath, file.name));
      }
    } else if (file.isDirectory() && file.name == 'nu:dx PCR') {
      files = fs.readdirSync(path.resolve(filepath, file.name), {
        withFileTypes: true,
      });

      files.forEach((file) => {
        if (file.isDirectory() && file.name == 'runs') {
          if (!fs.existsSync(path.resolve(destpath, file.name))) {
            fs.renameSync(path.resolve(filepath, 'nu:dx PCR', file.name), path.resolve(destpath, file.name));
          }
        }
      });
    }
  });
};
///findAndMoveRunsDir();
//fetch config from config.json and hardware
ipcMain.on('getConfig', async (event) => {
  let settings = store.get('settings');
  let wellCount = getDeviceType() ;
  settings.isDev = isDev;
  settings.version = app.getVersion();
  let hardwareId = await macaddress.one().then((mac) => mac);
  let serialNumber = ''; // await getSerialNumber();
  settings.device = { hardwareId, wellCount, serialNumber };
  event.returnValue = settings;
});

// archive run folder
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

//save config to config.json
ipcMain.handle('saveConfig', async (event, config) => {
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
ipcMain.handle('clearConfig', async (event) => {
  try {
    store.clear();
    return true;
  } catch (err) {
    console.log(err);
    logger(`clearConfig ${err}`, 'logErrors.txt');
    throw Error('Settings could not be saved');
  }
});



ipcMain.handle('getResult', async (event: Electron.IpcMainInvokeEvent, testid: string, done: boolean): Promise<IGetResultResponse> => {
  logger(`getResult ${testid}`, 'logInfos.txt');

  const baseDir = path.resolve(app.getPath('userData'), 'runs', done && testid !== 'demo' ? 'done' : '', testid);
  const filepath = path.join(baseDir, `${testid}.csv`);
  const configPath = path.join(baseDir, 'config.json');
  const launchFilePath = path.join(baseDir, 'lineGeneSetup.xml');
  const overridePath = path.join(baseDir, 'override.json');

  let resultFile = '';
  let configFile = '';
  let testStarted: number | Date;

  try {
    testStarted = fs.statSync(launchFilePath).mtime;
  } catch (error) {
    console.log('test launch file not found, defaulting to current time for test start');
    logger('test launch file not found, defaulting to current time for test start', 'logInfos.txt');
    testStarted = Date.now();
  }

  try {
    resultFile = fs.readFileSync(filepath, 'utf-8');
  } catch (error:any) {
    console.log(`error accessing result file for test ${testid}`);
    console.error(error);
    logger(`error accessing result file for test ${testid}`, 'logErrors.txt');
    logger(error.message, 'logErrors.txt');
    throw error;
  }

  try {
    configFile = fs.readFileSync(configPath, 'utf-8');
  } catch (error:any) {
    console.log(`error accessing config file for test ${testid}`);
    console.error(error);
    logger(error.message, 'logErrors.txt');
  }

  const override = fs.existsSync(overridePath)
    ? fs.readFileSync(overridePath, 'utf-8')
    : false;

  return { resultFile, configFile, testStarted, override };
});

/**
 * Reboot the device
 * @returns {Boolean} true if reboot successful
 * */
ipcMain.on('power', (event, reboot) => {
  if (reboot === 'reboot') {
    shutdown.reboot({ force: true });
  } else {
    shutdown.shutdown({ force: true });
  }
  event.returnValue = true;
});

//Define IntervalId for keeping focus
let focusInterval: NodeJS.Timeout;
/**
 * Start the test and run LineGene
 * @param {string} testid
 * @param {string} xmlContent
 * @param {object} settings
 * @param {Array} barcodes
 * @param {string} testmethod
 * @returns {Boolean} true if test started
 */
ipcMain.handle('startLineGene', (event: Electron.IpcMainInvokeEvent, testid: string, xmlContent: string, settings: ILineGeneSettings, barcodes: string[], testmethod: string): boolean => {
  // Mutate the settings object
  delete settings.account.authToken;
  settings.barcodes = barcodes;
  settings.testid = testid;
  settings.testmethod = testmethod;

  const pcrServerPath = 'C:\\Bioer\\PcrServer\\bin\\PcrServer.exe';
  const xmlPath = path.resolve(app.getPath('userData'), 'runs', testid, 'lineGeneSetup.xml');
  const outputPath = path.resolve(app.getPath('userData'), 'runs', testid, `${testid}.fqd`);
  const configPath = path.resolve(app.getPath('userData'), 'runs', testid, 'config.json');

  try {
    fs.mkdirSync(path.dirname(xmlPath), { recursive: true });
    fs.writeFileSync(xmlPath, xmlContent);
    fs.writeFileSync(configPath, JSON.stringify(settings));
  } catch (error:any) {
    console.error(error);
    logger(`startLineGene error: ${error.message}`, 'logErrors.txt');
  }

  const launchParam = `${xmlPath} ${outputPath}`;

  spawn('cmd', ['/c', `start ${pcrServerPath}`]);
  spawn('cmd.exe', [
    '/c',
    `start ${lineGenePath?.replace('LineGene1600 for research', '"LineGene1600 for research"')} /run ${launchParam}`
  ]);

  focusInterval = setInterval(() => {
    if(mainWindow)
    mainWindow.focus();
  }, 1000);

  return true;
});

/**
 * Stop the test and kill LineGene
 * @returns {Boolean} true if test stopped
 * */
ipcMain.handle('endLineGene', async (event:Electron.IpcMainInvokeEvent) => {
  try{
    ['Gene-9660.exe', 'LineGene1600.exe', 'PcrServer.exe'].forEach(killProcess);
    clearInterval(focusInterval);
    return true;
  }catch(error:any){
    console.log(error);
    logger(`endLineGene error: ${error.message}`, 'logErrors.txt');
    return  false;
  }
});


/**
 * Open Lid via Serial Port
 * */

ipcMain.handle('toggleLid', (event:Electron.IpcMainInvokeEvent): boolean => {
  console.log('Signal to toggle lid received.');
  logger('Signal to toggle lid received.', 'logErrors.txt');

  const buffer: number[] = [0x7b, 0x7c, 0x0, 0x2, 0x4d, 0x1, 0x0, 0x4c, 0x7c, 0x7d];
  if (isDev) {
    return true;
  }
  

  let serialport: SerialPort = new SerialPort({
    path: 'COM1',
    baudRate: 19200,
    parity: 'none',
    autoOpen: false,
  });

  serialport.open((err?: Error | null) => {
    if (err) {
      console.log('Error establishing serialport connection : ' + err.message);
      logger(`Error establishing serialport connection : ${err.message}`, 'logErrors.txt');
      return false;
    }
    serialport.write(buffer, (err?: Error | null, result?: number) => {
      if (err) {
        console.log('Error while opening lid : ' + err.message);
        logger(`Error while opening lid : ${err.message}`, 'logErrors.txt');
        return false;
      }
      if (result) {
        console.log('Response received after opening lid : ' + result);
      }
      serialport.close((err?: Error | null) => {
        if (err) {
          console.log('Error while closing serialport connection : ' + err.message);
          logger(`Error while closing serialport connection : ${err.message}`, 'logErrors.txt');
          return false;
        }
      });
    });
  });

  return true;
});

/**
 * bGet unsubmitted tests
 * @returns {Array} unsubmitted tests
 * */
ipcMain.handle('getUnsubmitted', (event:Electron.IpcMainInvokeEvent) => {
  const filePath = path.resolve(app.getPath('userData'), 'runs');
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
      .map((testid) => {
        const resultFilePath = path.resolve(app.getPath('userData'), 'runs', testid, testid + '.csv');
        const launchFilePath = path.resolve(app.getPath('userData'), 'runs', testid, 'lineGeneSetup.xml');
        let testStarted;
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

/**
 * Get test results
 * */
ipcMain.handle('getTests', (event: Electron.IpcMainInvokeEvent): ITestObject[] | boolean => {
  const filePath = path.resolve(app.getPath('userData'), 'runs');
  try {
    //Get Unsubmitted
    let getDirectories = fs
      .readdirSync(filePath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const unsubmittedTests = getDirectories
      .filter((testid) => {
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
      .map((testid) => {
        const resultDirectory = path.resolve(app.getPath('userData'), 'runs', testid);
        const resultFilePath = path.resolve(resultDirectory, testid + '.csv');
        const launchFilePath = path.resolve(resultDirectory, 'lineGeneSetup.xml');
        const configFilePath = path.resolve(resultDirectory, 'config.json');
        let testStarted;
        let testStartedMS;
        let testmethod;
        try {
          testStarted = fs.statSync(launchFilePath).mtime;
          testStartedMS = fs.statSync(launchFilePath).mtimeMs;
        } catch (error) {
          testStarted = 'xml not found';
        }
        const testFinished = fs.statSync(resultFilePath).mtime;
        const testFinishedMS = fs.statSync(resultFilePath).mtimeMs;
        try {
          testmethod = JSON.parse(fs.readFileSync(configFilePath, 'utf8')).testmethod;
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
      return unsubmittedTests as ITestObject[];
    }

    //Get Submitted
    getDirectories = fs
      .readdirSync(path.resolve(filePath, 'done'), {
        withFileTypes: true,
      })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const submittedTests = getDirectories
      .filter((testid) => {
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
      .map((testid) => {
        const resultDirectory = path.resolve(app.getPath('userData'), 'runs', 'done', testid);
        const resultFilePath = path.resolve(resultDirectory, testid + '.csv');
        const launchFilePath = path.resolve(resultDirectory, 'lineGeneSetup.xml');
        const configFilePath = path.resolve(resultDirectory, 'config.json');
        let testStartedMS;
        let testStarted;
        let testmethod;
        try {
          testStarted = fs.statSync(launchFilePath).mtime;
          testStartedMS = fs.statSync(launchFilePath).mtimeMs;
        } catch (error) {
          testStarted = 'xml not found';
        }
        const testFinished = fs.statSync(resultFilePath).mtime;
        const testFinishedMS = fs.statSync(resultFilePath).mtimeMs;
        try {
          testmethod = JSON.parse(fs.readFileSync(configFilePath, 'utf8')).testmethod;
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
    })as ITestObject[];
     
  } catch (err: any) {
    console.log(err);
    logger(err, 'logErrors.txt');
    return false;
  }
});

/**
 * @param {string} filePath
 * @returns {boolean}
 * @description Moves a test from the "runs" directory to the "done" directory
 * */
ipcMain.handle('moveFiles', (event, testid) => {
  if (testid !== 'demo') {
    const sourcePath = path.resolve(app.getPath('userData'), 'runs', testid);
    const destPath = path.resolve(app.getPath('userData'), 'runs', 'done', testid);
    try {
      fs.mkdirSync(destPath, { recursive: true });
      fs.readdirSync(sourcePath).forEach((file) => {
        fs.renameSync(path.resolve(sourcePath, file), path.resolve(destPath, file));
      });
      fs.rmdirSync(sourcePath);
    } catch (err) {
      return err;
    }
  }
  return true;
});

/**
 * check if USB is connected
 * @returns {boolean}
 * */
ipcMain.handle('checkUSB', (event) => {
  if (isDev) {
    return true;
  }

  try {
    fs.accessSync('D:\\', fs.constants.F_OK);
    return true;
  } catch (err) {
    console.log('No Drive found or Drive not accessible');
    logger('No Drive found or Drive not accessible', 'logInfos.txt');
    //console.log(err)
    return false;
  }
});

//Save to USB
ipcMain.handle('saveToUSB', (event, testid, results) => {
  console.log(results);
  logger(JSON.stringify(results), 'logInfos.txt');
  const filename = testid + '.csv';
  const destPath = 'D:\\nu-dx-pcr\\runs';
  const filepath = path.resolve(destPath, filename);
  try {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, results);
  } catch (err:any) {
    console.log(err);
    logger(err, 'logErrors.txt');
    logger(`saveToUSB: ${err}`, 'logErrors.txt');
    throw err;
  }
  return true;
});

/**
 * Get Device Infos
 * @returns {object}  { hardwareId, deviceType, serialNumber }
 * */
ipcMain.handle('getDeviceInfo', async (event) => {
  try {
    let hardwareId = await macaddress.one().then((mac) => mac);
    let serialNumber = ''; //await getSerialNumber();
    let deviceType = getDeviceType();
    return { hardwareId, deviceType, serialNumber };
  } catch (err:any) {
    console.log(err);
    logger(err, 'logErrors.txt');
    logger(`getDeviceInfo: ${err}`, 'logErrors.txt');
    throw err;
  }
});

/**
 * Provide App Version
 * @returns {string}  version
 * */
ipcMain.handle('getVersion', (event) => {
  return app.getVersion();
});

/**
 * Exit App
 * */
ipcMain.handle('exit', (event) => {
  spawn('taskkill', ['/f', '/im', 'LineGene1600.exe']);
  spawn('taskkill', ['/f', '/im', 'Gene-9660.exe']);
  spawn('taskkill', ['/f', '/im', 'PcrServer.exe']);
  app.quit();
});

/**
 * Log Errors or Infos
 * */
ipcMain.handle('log-Events', (event, message, logName) => logger(message, logName));
ipcMain.handle('launch-updates', (event) => updater());

/**
 * Check for updates and run the update
 * @returns {void}
 */

function updater() {
  console.log(store.get('settings').user.updateType === 'beta');
  autoUpdater.allowPrerelease = store.get('settings').user.updateType === 'beta';
  autoUpdater.checkForUpdates();
  autoUpdater.on('checking-for-update', () => {
    if (splash) {
      splash.webContents.send('updateStatus', 'checking for update...');
    }
    
  });
  autoUpdater.on('error', (err) => {
    console.log(err);
    if (splash) {
      splash.webContents.send('updateStatus', 'update failed, launching current version');
    }
    
    logger(`update failed: ${err}`, 'logErrors.txt');
    setTimeout(function () {
      if (splash && mainWindow) {
          splash.hide();
          mainWindow.show();
      }
  }, 2000);  
  
  });
  autoUpdater.on('update-available', () => {
    splash&&splash.webContents.send('updateStatus', 'update available...');
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let message = 'downloading update: ' + progressObj.percent.toFixed(1) + '%';
    //message += ' (' + progressObj.transferred / 1000 + "k/" + progressObj.total + 'k)'
    splash&& splash.webContents.send('updateStatus', message);
  });
  autoUpdater.on('update-downloaded', () => {
    splash&&splash.webContents.send('updateStatus', 'restarting & installing update...');
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 2000);
  });
  autoUpdater.on('update-not-available', (info) => {
    splash&&splash.webContents.send('updateStatus', 'version is up to date, launching app...');
    setTimeout(() => {
      splash&&splash.hide();
      mainWindow&& mainWindow.show();
    }, 2000);
  });
}

/**
 * Download the latest version of the app
 * @returns {void}
 * */
ipcMain.handle('downloadApp', async (event) => {
  autoUpdater.checkForUpdates();
  autoUpdater.downloadUpdate();
});

/** Edit test results */
ipcMain.handle('editResults', async (event, testid, results) => {
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

/**
 * delete all override files
 * @returns {void}
 * */
ipcMain.handle('deleteAllOverrides', async (event) => {
  try {
    const destPath = path.resolve(app.getPath('userData'), 'runs');
    const files = fs.readdirSync(destPath);
    files.forEach((file) => {
      const overridePath = path.resolve(destPath, file, 'override.json');
      if (fs.existsSync(overridePath)) {
        fs.unlinkSync(overridePath);
      }
    });
  } catch (err) {
    console.log(err);
  }
  return true;
});

/**
 * delete override file
 * @returns {void}
 * */
ipcMain.handle('deleteOverride', async (event, testid) => {
  try {
    const destPath = path.resolve(app.getPath('userData'), 'runs', testid, 'override.json');
    if (fs.existsSync(destPath)) {
      fs.unlink(destPath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
  return true;
});

/**
 * relaunch app
 * @returns {void}
 * */
ipcMain.handle('relaunchApp', async (event) => {
  app.relaunch();
  app.exit();
});

function copyDir(src: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  const files = fs.readdirSync(src);

  for (let i = 0; i < files.length; i++) {
    const current = fs.lstatSync(path.join(src, files[i]));
    if (current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]));
    } else if (current.isSymbolicLink()) {
      const symlink = fs.readlinkSync(path.join(src, files[i]));
      fs.symlinkSync(symlink, path.join(dest, files[i]));
    } else {
      fs.copyFileSync(path.join(src, files[i]), path.join(dest, files[i]));
    }
  }
}

/**
 * copy logos to the app folder
 * @returns {void}
 * */
ipcMain.handle('copyLogos', async (event) => {
  try {
    const logosPath = path.resolve(__dirname, '../src/assets/Logos');
    const destPath = path.resolve(app.getPath('userData'), 'logos');
    copyDir(logosPath, destPath);
  } catch (err) {
    console.log(err);
  }
  return true;
});
