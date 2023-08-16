import { IpcMainInvokeEvent } from 'electron';
import { IFile } from '../interfaces/interfaces';
const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * delete all override files
 * @returns {void}
 * */
const ipcMainDeleteAllOverrides = (): void => {
  ipcMain.handle('deleteAllOverrides', async (event: IpcMainInvokeEvent) => {
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
};

/**
 * delete override file
 * @returns {void}
 * */
const ipcMainDeleteOverride = (): void => {
  ipcMain.handle('deleteOverride', async (event: IpcMainInvokeEvent, testid: string) => {
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
};

/**
 * relaunch app
 * @returns {void}
 * */
const ipcMainRelaunchApp = (): void => {
  ipcMain.handle('relaunchApp', async (event: IpcMainInvokeEvent) => {
    app.relaunch();
    app.exit();
  });
};

export const ipcMainCopyLogos = () => {
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
  ipcMain.handle('copyLogos', async (event: IpcMainInvokeEvent) => {
    try {
      const logosPath = path.resolve(__dirname, '../src/assets/Logos');
      const destPath = path.resolve(app.getPath('userData'), 'logos');
      copyDir(logosPath, destPath);
    } catch (err) {
      console.log(err);
    }
    return true;
  });
};

module.exports = {
  ipcMainDeleteAllOverrides,
  ipcMainDeleteOverride,
  ipcMainRelaunchApp,
  ipcMainCopyLogos,
};
