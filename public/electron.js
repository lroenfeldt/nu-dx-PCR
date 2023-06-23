// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const shutdown = require('electron-shutdown-command');
const childProcess = require('child_process');
const isDev = require('electron-is-dev');
const { SerialPort } = require('serialport');
const { autoUpdater } = require('electron-updater');
const AutoLaunch = require('auto-launch');
const os = require('os');
const macaddress = require('macaddress');
const { spawn } = require('./spawn');
const { logger } = require('./logger');
const { el } = require('date-fns/locale');
let mainWindow;
let splash;
let lineGenePath;

const forceConsole = false;
/**
 * check installed version of LineGene
 * @returns {string} the version of LineGene
 */
const getDeviceType = () => {
  let lineGene1644Path = 'C:\\Bioer\\LineGene1600 for research\\1644\\bin\\LineGene1600.exe';
  let lineGene1640Path = 'C:\\BIOER\\LineGene1600 for research\\1640\\bin\\LineGene1600.exe';
  let lineGene96Path = 'C:\\BIOER\\96\\bin\\Gene-9660.exe';

  if (isDev) {
    return '16';
  }

  try {
    const res = fs.realpathSync(lineGene1644Path);
    fs.accessSync(res, fs.constants.F_OK);
    console.log('LineGene1644 found');
    logger('LineGene1644 found', 'logInfos.txt');
    lineGenePath = res;
    return '16';
  } catch (error) {
    console.log('LineGene1644 not found');
    logger('LineGene1644 not found', 'logInfos.txt');
  }

  try {
    const res = fs.realpathSync(lineGene1640Path);
    fs.accessSync(res, fs.constants.F_OK);
    console.log('LineGene1640 found');
    logger('LineGene1640 found', 'logInfos.txt');
    lineGenePath = res;
    return '16';
  } catch (error) {
    console.log(lineGene1640Path);
    console.log('LineGene1640 not found');
    logger('LineGene1640 not found', 'logInfos.txt');
  }

  try {
    const res = fs.realpathSync(lineGene96Path);
    fs.accessSync(res, fs.constants.F_OK);
    console.log('LineGene9600 found');
    lineGenePath = res;
    return '96';
  } catch (error) {
    console.log('LineGene9600 not found');
    logger('LineGene9600 not found', 'logInfos.txt');
  }
  console.log(new Error('No LineGene Installation found'));
  logger('No LineGene Installation found', 'logInfos.txt');
  return false;
};
/**
 * Default configuration
 *  @type {string}
 */
const store = new Store({
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
          name: 'Procomcure Biotech',
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
      },
    },
  },
});

/**
 * Create and configure the browser window.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    resizable: isDev ? true : false,
    fullscreen: isDev ? false : true,
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
  let devtools = null;

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
    spawn('taskkill', ['/f', '/im', 'Gene-9660.exe']);
    spawn('taskkill', ['/f', '/im', 'LineGene1600.exe']);
    spawn('taskkill', ['/f', '/im', 'PcrServer.exe']);
    app.quit();
  });

  // and load the index.html of the app.
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  // Open the DevTools.
  if (isDev || forceConsole) {
    devtools = new BrowserWindow();
    //mainWindow.webContents.openDevTools({ mode: "detach" });
    mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

/**
 * Create and configure the splash window.
 * */
function createSplash() {
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createSplash();
  createWindow();
  spawn('taskkill', ['/f', '/im', 'PcrServer.exe']);

  //Launch app on startup
  let autoLaunch = new AutoLaunch({
    name: 'PhoenixDx POC',
    path: app.getPath('exe'),
  });
  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled && !isDev) autoLaunch.enable();
  });

  updater();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  spawn('taskkill', ['/f', '/im', 'LineGene1600.exe']);
  spawn('taskkill', ['/f', '/im', 'Gene-9660.exe']);
  spawn('taskkill', ['/f', '/im', 'PcrServer.exe']);

  app.quit();
});

/**check if result file is present and move to run directory*/
ipcMain.on('checkResultFile', (event, testid) => {
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

/**move resultfile to run directory*/
ipcMain.on('moveResultFile', (event, testid) => {
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

const findAndMoveRunsDir = () => {
  let filepath = path.resolve(os.homedir(), 'Documents');
  let destpath = path.resolve(app.getPath('userData'));
  let files = fs.readdirSync(filepath, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isDirectory() && file.name == 'runs') {
      if (!fs.existsSync(path.resolve(destpath, file.name))) {
        fs.renameSync(path.resolve(filepath, file.name), path.resolve(destpath, file.name));
      }
    } else if (file.isDirectory() && file.name == 'phoenixdx-poc') {
      files = fs.readdirSync(path.resolve(filepath, file.name), {
        withFileTypes: true,
      });

      files.forEach((file) => {
        if (file.isDirectory() && file.name == 'runs') {
          if (!fs.existsSync(path.resolve(destpath, file.name))) {
            fs.renameSync(path.resolve(filepath, 'phoenixdx-poc', file.name), path.resolve(destpath, file.name));
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
  let wellCount = getDeviceType();
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
    logger(`saveConfig ${JSON.stringify(err)}`, 'logErrors.txt');
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
    logger(`clearConfig ${JSON.stringify(err)}`, 'logErrors.txt');
    throw Error('Settings could not be saved');
  }
});

/**
 * Get result file from run directory
 * @param {string} testid
 * @param {Boolean} done
 * @returns {object} {resultFile, configFile, testStarted}
 */
ipcMain.handle('getResult', async (event, testid, done) => {
  logger(`getResult ${testid}`, 'logInfos.txt');
  let filepath;
  let configPath;
  let launchFilePath;
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
  let testStarted;

  try {
    testStarted = fs.statSync(launchFilePath).mtime;
  } catch (error) {
    console.log('test launch file not found, defaulting to current time for test start');
    logger(`test launch file not found, defaulting to current time for test start`, 'logInfos.txt');
    testStarted = Date.now();
  }

  try {
    resultFile = fs.readFileSync(filepath, 'utf-8');
  } catch (error) {
    console.log('error accessing result file for test' + testid);
    console.log(error);
    logger(`error accessing result file for test ${testid}`, 'logErrors.txt');
    logger(JSON.stringify(error), 'logErrors.txt');
    throw error;
  }
  try {
    configFile = fs.readFileSync(configPath, 'utf-8');
  } catch (error) {
    console.log('error accessing config file for test' + testid);
    console.log(error);
    logger(JSON.stringify(error), 'logErrors.txt');
  }
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
let focusInterval;

/**
 * Start the test and run LineGene
 * @param {string} testid
 * @param {string} xmlContent
 * @param {object} settings
 * @param {Array} barcodes
 * @param {string} testmethod
 * @returns {Boolean} true if test started
 */
ipcMain.on('startLineGene', (event, testid, xmlContent, settings, barcodes, testmethod) => {
  delete settings.account.authToken;
  settings.barcodes = barcodes;
  settings.testid = testid;
  settings.testmethod = testmethod;

  const pcrServerPath = 'C:\\Bioer\\PcrServer\\bin\\PcrServer.exe';
  const xmlPath = path.resolve(app.getPath('userData'), 'runs', testid, 'lineGeneSetup.xml');
  const outputPath = path.resolve(app.getPath('userData'), 'runs', testid, testid + '.fqd');
  const configPath = path.resolve(app.getPath('userData'), 'runs', testid, 'config.json');

  fs.mkdirSync(path.dirname(xmlPath), { recursive: true }, (err) => {
    console.log(err);
    logger(`startLineGene error: ${JSON.stringify(err)}`, 'logErrors.txt');
  });
  fs.writeFileSync(xmlPath, xmlContent, (err) => {
    console.log(err);
    logger(`startLineGene error: ${JSON.stringify(err)}`, 'logErrors.txt');
  });
  fs.writeFileSync(configPath, JSON.stringify(settings), (err) => {
    console.log(err);
    logger(`startLineGene error: ${JSON.stringify(err)}`, 'logErrors.txt');
  });
  const launchParam = `${xmlPath} ${outputPath}`;

  spawn('cmd', ['/c', 'start ' + pcrServerPath]);
  spawn('cmd.exe', [
    '/c',
    'start ' +
      lineGenePath?.replace('LineGene1600 for research', '"LineGene1600 for research"') +
      ' /run ' +
      launchParam,
  ]);
  focusInterval = setInterval(() => {
    mainWindow.focus();
  }, 1000);
  event.returnValue = true;
});

/**
 * Stop the test and kill LineGene
 * @returns {Boolean} true if test stopped
 * */
ipcMain.on('endLineGene', (event) => {
  spawn('taskkill', ['/f', '/im', 'LineGene1600.exe']);
  spawn('taskkill', ['/f', '/im', 'Gene-9660.exe']);
  spawn('taskkill', ['/f', '/im', 'PcrServer.exe']);
  clearInterval(focusInterval);
  event.returnValue = true;
});

/**
 * Open Lid via Serial Port
 * */
ipcMain.handle('toggleLid', (event) => {
  const buffer = [0x7b, 0x7c, 0x0, 0x2, 0x4d, 0x1, 0x0, 0x4c, 0x7c, 0x7d];

  if (isDev) {
    // dialog.showMessageBox({
    //   type: 'info',
    //   buttons: ['Got it!'],
    //   defaultId: 0,
    //   title: 'Lid Open',
    //   message: 'Imagine an open lid',
    //   detail: 'If this device had a lid, said lid would be open now. Which is great - If you wanted an open lid, that is. Otherwise something went quite obviously wrong here and you should get back to work fixing that issue!'
    // })
    return true;
  }

  let serialport = new SerialPort({
    path: 'COM1',
    baudRate: 19200,
    parity: 'none',
    autoOpen: false,
  });

  serialport.open((err) => {
    if (err) {
      console.log('Error establishing serialport connection : ' + err);
      logger(`Error establishing serialport connection : ${JSON.stringify(err)}`, 'logErrors.txt');
      return false;
    }
    serialport.write(buffer, (err, result) => {
      if (err) {
        console.log('Error while opening lid : ' + err);
        logger(`Error while opening lid : ${JSON.stringify(err)}`, 'logErrors.txt');
        return false;
      }
      if (result) {
        console.log('Response received after opening lid : ' + result);
      }
      serialport.close((err) => {
        if (err) {
          console.log('Error while closing serialport connection : ' + err);
          logger(`Error while closing serialport connection : ${JSON.stringify(err)}`, 'logErrors.txt');
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
ipcMain.handle('getUnsubmitted', (event) => {
  const filePath = path.resolve(app.getPath('userData'), 'runs');
  try {
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
ipcMain.handle('getTests', (event) => {
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

    return unsubmittedTests.concat(submittedTests).sort((a, b) => b.testStartedMS - a.testStartedMS);
  } catch (err) {
    console.log(err);
    logger(JSON.stringify(err), 'logErrors.txt');
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
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const dateTime = date + '-' + time;

  const filename = testid + '.csv';
  const destPath = 'D:\\PhoenixDxPOC\\runs';
  const filepath = path.resolve(destPath, filename);
  try {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, results);
  } catch (err) {
    console.log(err);
    logger(JSON.stringify(err), 'logErrors.txt');
    logger(`saveToUSB: ${JSON.stringify(err)}`, 'logErrors.txt');
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
  } catch (err) {
    console.log(err);
    logger(JSON.stringify(err), 'logErrors.txt');
    logger(`getDeviceInfo: ${JSON.stringify(err)}`, 'logErrors.txt');
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
    splash.webContents.send('updateStatus', 'searching for update...');
  });
  autoUpdater.on('error', (err) => {
    console.log(err);
    splash.webContents.send('updateStatus', 'update failed, launching current version');
    logger(`update failed: ${JSON.stringify(err)}`, 'logErrors.txt');
    setTimeout(() => {
      splash.hide();
      mainWindow.show();
    }, 2000);
  });
  autoUpdater.on('update-available', () => {
    splash.webContents.send('updateStatus', 'update available...');
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let message = 'downloading update: ' + progressObj.percent.toFixed(1) + '%';
    //message += ' (' + progressObj.transferred / 1000 + "k/" + progressObj.total + 'k)'
    splash.webContents.send('updateStatus', message);
  });
  autoUpdater.on('update-downloaded', () => {
    splash.webContents.send('updateStatus', 'restarting & installing update...');
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 2000);
  });
  autoUpdater.on('update-not-available', (info) => {
    splash.webContents.send('updateStatus', 'version is up to date, launching app...');
    setTimeout(() => {
      splash.hide();
      mainWindow.show();
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
