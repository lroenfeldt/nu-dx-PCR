import { Dirent } from 'fs';
import { IFile, ISettings, IBarcode, IDevice, IProgressObj } from './interfaces/interfaces';
import * as Module from './electron/moduleOne';
import * as ModuleTwo from './electron/moduleTwo';
// Modules to control application life and create native browser window
const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const shutdown = require('electron-shutdown-command');
const isDev = require('electron-is-dev');
const { SerialPort } = require('serialport');
const { autoUpdater } = require('electron-updater');
const macaddress = require('macaddress');
const { spawn } = require('./spawn');
const { logger } = require('./logger');

// ModuleOne

/**
 *
 * @returns boolean
 */
Module.getDeviceType();

/**
 * Create and configure the browser window.
 */
Module.createWindow();

/**
 * Create and configure the splash window.
 * */
Module.createSplash();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
ModuleTwo.whenReady();

// ModuleTwo

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
ModuleTwo.on();

/**check if result file is present and move to run directory*/
ModuleTwo.ipcMainResult();

/**move resultfile to run directory*/
ModuleTwo.ipcMainOnResultfile();

ModuleTwo.ipcMainConfig();

// fetch config from config.json and hardware
ModuleTwo.ipcMainGetConfig();

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
ipcMain.handle('saveConfig', async (event: Event, config: Object) => {
  try {
    Module.store.set('settings', config);
    return true;
  } catch (err) {
    console.log(err);
    logger(`saveConfig ${err}`, 'logErrors.txt');
    throw Error('Settings could not be saved');
  }
});

//reset config.json to defaults
ipcMain.handle('clearConfig', async (event: Event) => {
  try {
    Module.store.clear();
    return true;
  } catch (err) {
    console.log(err);
    logger(`clearConfig ${err}`, 'logErrors.txt');
    throw Error('Settings could not be saved');
  }
});

/**
 * Get result file from run directory
 * @param {string} testid
 * @param {Boolean} done
 * @returns {object} {resultFile, configFile, testStarted}
 */
ipcMain.handle('getResult', async (event: Event, testid: string, done: boolean) => {
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
  } catch (error) {
    console.log('error accessing result file for test' + testid);
    console.log(error);
    logger(`error accessing result file for test ${testid}`, 'logErrors.txt');
    logger(error, 'logErrors.txt');
    throw error;
  }
  try {
    configFile = fs.readFileSync(configPath, 'utf-8');
  } catch (error) {
    console.log('error accessing config file for test' + testid);
    console.log(error);
    logger(error, 'logErrors.txt');
  }
  return { resultFile, configFile, testStarted, override };
});

/**
 * Reboot the device
 * @returns {Boolean} true if reboot successful
 * */
ipcMain.on('power', (event: Event, reboot: string | boolean) => {
  if (reboot === 'reboot') {
    shutdown.reboot({ force: true });
  } else {
    shutdown.shutdown({ force: true });
  }
  event.returnValue = true;
});

//Define IntervalId for keeping focus
let focusInterval: string | number | NodeJS.Timeout | undefined;

/**
 * Start the test and run LineGene
 * @param {string} testid
 * @param {string} xmlContent
 * @param {object} settings
 * @param {Array} barcodes
 * @param {string} testmethod
 * @returns {Boolean} true if test started
 */
ipcMain.on(
  'startLineGene',
  (event: Event, testid: string, xmlContent: string, settings: ISettings, barcodes: IBarcode[], testmethod: string) => {
    delete settings.account.authToken;
    settings.barcodes = barcodes;
    settings.testid = testid;
    settings.testmethod = testmethod;

    const pcrServerPath = 'C:\\Bioer\\PcrServer\\bin\\PcrServer.exe';
    const xmlPath = path.resolve(app.getPath('userData'), 'runs', testid, 'lineGeneSetup.xml');
    const outputPath = path.resolve(app.getPath('userData'), 'runs', testid, testid + '.fqd');
    const configPath = path.resolve(app.getPath('userData'), 'runs', testid, 'config.json');

    fs.mkdirSync(path.dirname(xmlPath), { recursive: true }, (err: Error) => {
      console.log(err);
      logger(`startLineGene error: ${err}`, 'logErrors.txt');
    });
    fs.writeFileSync(xmlPath, xmlContent, (err: Error) => {
      console.log(err);
      logger(`startLineGene error: ${err}`, 'logErrors.txt');
    });
    fs.writeFileSync(configPath, JSON.stringify(settings), (err: Error) => {
      console.log(err);
      logger(`startLineGene error: ${err}`, 'logErrors.txt');
    });
    const launchParam = `${xmlPath} ${outputPath}`;

    spawn('cmd', ['/c', 'start ' + pcrServerPath]);
    spawn('cmd.exe', [
      '/c',
      'start ' +
        Module.lineGenePath?.replace('LineGene1600 for research', '"LineGene1600 for research"') +
        ' /run ' +
        launchParam,
    ]);
    focusInterval = setInterval(() => {
      Module.mainWindow.focus();
    }, 1000);
    event.returnValue = true;
  }
);

/**
 * Stop the test and kill LineGene
 * @returns {Boolean} true if test stopped
 * */
ipcMain.on('endLineGene', (event: Event) => {
  ['Gene-9660.exe', 'LineGene1600.exe', 'PcrServer.exe'].forEach(Module.killProcess);
  clearInterval(focusInterval);
  event.returnValue = true;
});

/**
 * Open Lid via Serial Port
 * */
ipcMain.handle('toggleLid', (event: Event) => {
  console.log('Signal to toggle lid received.');
  logger('Signal to toggle lid received.', 'logErrors.txt');

  const buffer = [0x7b, 0x7c, 0x0, 0x2, 0x4d, 0x1, 0x0, 0x4c, 0x7c, 0x7d];

  if (isDev) {
    /* dialog.showMessageBox({
      type: 'info',
      buttons: ['Got it!'],
      defaultId: 0,
      title: 'Lid Open',
      message: 'Imagine an open lid',
      detail: 'If this device had a lid, said lid would be open now. Which is great - 
      If you wanted an open lid, that is. Otherwise something went quite obviously wrong here and you should get back to work fixing that issue!'
    }) */
    return true;
  }

  let serialport = new SerialPort({
    path: 'COM1',
    baudRate: 19200,
    parity: 'none',
    autoOpen: false,
  });

  serialport.open((err: Error) => {
    if (err) {
      console.log('Error establishing serialport connection : ' + err);
      logger(`Error establishing serialport connection : ${err}`, 'logErrors.txt');
      return false;
    }
    serialport.write(buffer, (err: Error, result: string) => {
      if (err) {
        console.log('Error while opening lid : ' + err);
        logger(`Error while opening lid : ${err}`, 'logErrors.txt');
        return false;
      }
      if (result) {
        console.log('Response received after opening lid : ' + result);
      }
      serialport.close((err: Error) => {
        if (err) {
          console.log('Error while closing serialport connection : ' + err);
          logger(`Error while closing serialport connection : ${err}`, 'logErrors.txt');
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
ipcMain.handle('getUnsubmitted', (event: Event) => {
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

/**
 * Get test results
 * */
ipcMain.handle('getTests', (event: Event) => {
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

/**
 * @param {string} filePath
 * @returns {boolean}
 * @description Moves a test from the "runs" directory to the "done" directory
 * */
ipcMain.handle('moveFiles', (event: Event, testid: string) => {
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

/**
 * check if USB is connected
 * @returns {boolean}
 * */
ipcMain.handle('checkUSB', (event: Event) => {
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
ipcMain.handle('saveToUSB', (event: Event, testid: string, results: string[]) => {
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

/**
 * Get Device Infos
 * @returns {object}  { hardwareId, deviceType, serialNumber }
 * */
ipcMain.handle('getDeviceInfo', async (event: Event) => {
  try {
    let hardwareId = await macaddress.one().then((mac: IDevice) => mac);
    let serialNumber = ''; //await getSerialNumber();
    let deviceType = Module.getDeviceType();
    return { hardwareId, deviceType, serialNumber };
  } catch (err) {
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
ipcMain.handle('getVersion', (event: Event) => {
  return app.getVersion();
});

/**
 * Exit App
 * */
ipcMain.handle('exit', (event: Event) => {
  spawn('taskkill', ['/f', '/im', 'LineGene1600.exe']);
  spawn('taskkill', ['/f', '/im', 'Gene-9660.exe']);
  spawn('taskkill', ['/f', '/im', 'PcrServer.exe']);
  app.quit();
});

/**
 * Log Errors or Infos
 * */
ipcMain.handle('log-Events', (event: Event, message: string, logName: string) => logger(message, logName));
ipcMain.handle('launch-updates', (event: Event) => updater());

/**
 * Check for updates and run the update
 * @returns {void}
 */

function updater(): void {
  console.log(Module.store.get('settings').user.updateType === 'beta');
  autoUpdater.allowPrerelease = Module.store.get('settings').user.updateType === 'beta';
  autoUpdater.checkForUpdates();
  autoUpdater.on('checking-for-update', () => {
    Module.splash.webContents.send('updateStatus', 'searching for update...');
  });
  autoUpdater.on('error', (err: Error) => {
    console.log(err);
    Module.splash.webContents.send('updateStatus', 'update failed, launching current version');
    logger(`update failed: ${err}`, 'logErrors.txt');
    setTimeout(() => {
      Module.splash.hide();
      Module.mainWindow.show();
    }, 2000);
  });
  autoUpdater.on('update-available', () => {
    Module.splash.webContents.send('updateStatus', 'update available...');
  });
  autoUpdater.on('download-progress', (progressObj: IProgressObj) => {
    let message = 'downloading update: ' + progressObj.percent.toFixed(1) + '%';
    //message += ' (' + progressObj.transferred / 1000 + "k/" + progressObj.total + 'k)'
    Module.splash.webContents.send('updateStatus', message);
  });
  autoUpdater.on('update-downloaded', () => {
    Module.splash.webContents.send('updateStatus', 'restarting & installing update...');
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 2000);
  });
  autoUpdater.on('update-not-available', (info: string) => {
    Module.splash.webContents.send('updateStatus', 'version is up to date, launching app...');
    setTimeout(() => {
      Module.splash.hide();
      Module.mainWindow.show();
    }, 2000);
  });
}

/**
 * Download the latest version of the app
 * @returns {void}
 * */
ipcMain.handle('downloadApp', async (event: Event) => {
  autoUpdater.checkForUpdates();
  autoUpdater.downloadUpdate();
});

/** Edit test results */
ipcMain.handle('editResults', async (event: Event, testid: string, results: string[]) => {
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
ipcMain.handle('deleteAllOverrides', async (event: Event) => {
  try {
    const destPath = path.resolve(app.getPath('userData'), 'runs');
    const files = fs.readdirSync(destPath);
    files.forEach((file: IFile) => {
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
ipcMain.handle('deleteOverride', async (event: Event, testid: string) => {
  try {
    const destPath = path.resolve(app.getPath('userData'), 'runs', testid, 'override.json');
    if (fs.existsSync(destPath)) {
      fs.unlink(destPath, (err: Error) => {
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
ipcMain.handle('relaunchApp', async (event: Event) => {
  app.relaunch();
  app.exit();
});

function copyDir(src: string, dest: string) {
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
ipcMain.handle('copyLogos', async (event: Event) => {
  try {
    const logosPath = path.resolve(__dirname, '../src/assets/Logos');
    const destPath = path.resolve(app.getPath('userData'), 'logos');
    copyDir(logosPath, destPath);
  } catch (err) {
    console.log(err);
  }
  return true;
});
