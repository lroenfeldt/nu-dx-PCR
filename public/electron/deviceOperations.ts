const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('./spawn');
const { logger } = require('./logger');
const shutdown = require('electron-shutdown-command');
const { SerialPort } = require('serialport');
const isDev = require('electron-is-dev');
import { IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { IBarcode, ISettings } from '../interfaces/interfaces';
const { killProcess, lineGenePath, mainWindow } = require('./constants');

/**
 * Start the test and run LineGene
 * @param {string} testid
 * @param {string} xmlContent
 * @param {object} settings
 * @param {Array} barcodes
 * @param {string} testmethod
 * @returns {Boolean} true if test started
 */
let focusInterval: string | number | NodeJS.Timeout | undefined;

/**
 * Reboot the device
 * @returns {Boolean} true if reboot successful
 **/
const ipcMainOnPower = () => {
  ipcMain.on('power', (event: IpcMainEvent, reboot: string | boolean) => {
    if (reboot === 'reboot') {
      shutdown.reboot({ force: true });
    } else {
      shutdown.shutdown({ force: true });
    }
    event.returnValue = true;
  });
};

/**
 * Define IntervalId for keeping focus
 **/
const ipcMainOnStartLineGene = () => {
  ipcMain.on(
    'startLineGene',
    (
      event: IpcMainEvent,
      testid: string,
      xmlContent: string,
      settings: ISettings,
      barcodes: IBarcode[],
      testmethod: string
    ) => {
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
          lineGenePath?.replace('LineGene1600 for research', '"LineGene1600 for research"') +
          ' /run ' +
          launchParam,
      ]);
      focusInterval = setInterval(() => {
        mainWindow.focus();
      }, 1000);
      event.returnValue = true;
    }
  );
};

/**
 * Define IntervalId for keeping focus
 */
const ipcMainStartLineGene = () => {
  ipcMain.on(
    'startLineGene',
    (
      event: IpcMainEvent,
      testid: string,
      xmlContent: string,
      settings: ISettings,
      barcodes: IBarcode[],
      testmethod: string
    ) => {
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
          lineGenePath?.replace('LineGene1600 for research', '"LineGene1600 for research"') +
          ' /run ' +
          launchParam,
      ]);
      focusInterval = setInterval(() => {
        mainWindow.focus();
      }, 1000);
      event.returnValue = true;
    }
  );
};

/**
 * Stop the test and kill LineGene
 */
const ipcMainEndLineGene = () => {
  ipcMain.on('endLineGene', (event: IpcMainEvent) => {
    ['Gene-9660.exe', 'LineGene1600.exe', 'PcrServer.exe'].forEach(killProcess);
    clearInterval(focusInterval);
    event.returnValue = true;
  });
};

/**
 * Open Lid via Serial Port
 * */
const ipcMainToggleLid = () => {
  ipcMain.handle('toggleLid', (event: IpcMainInvokeEvent) => {
    console.log('Signal to toggle lid received.');
    logger('Signal to toggle lid received.', 'logErrors.txt');

    const buffer = [0x7b, 0x7c, 0x0, 0x2, 0x4d, 0x1, 0x0, 0x4c, 0x7c, 0x7d];

    if (isDev) {
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
};

module.exports = {
  ipcMainOnPower,
  ipcMainOnStartLineGene,
  ipcMainStartLineGene,
  ipcMainEndLineGene,
  ipcMainToggleLid,
};
