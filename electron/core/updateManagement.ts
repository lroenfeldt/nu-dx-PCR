import { ipcMain } from "electron";
import { mainWindow, splash, store } from "../main";
import { autoUpdater } from "electron-updater";
import { logger } from "./createLogs/logger";

export function launchUpdates() {
  try {
    ipcMain.handle("launch-updates", (_event) => updater());
  } catch (error) {
    console.log(error);
    logger(`${error}`);
  }
}

export async function updater() {
  /**
   * Check for updates and run the update
   * @returns {void}
   */
  try {
    if (store.get("settings").user.autoUpdate) {
      autoUpdater.allowPrerelease =
        store.get("settings").user.updateType === "beta";
      autoUpdater.checkForUpdates();

      autoUpdater.on("checking-for-update", () => {
        if (splash) {
          splash.webContents.send("updateStatus", "checking for update...");
        }
      });

      autoUpdater.on("error", (err) => {
        console.error(err);
        if (splash) {
          splash.webContents.send(
            "updateStatus",
            "update failed, launching current version"
          );
        }

        logger(`update failed: ${err}`);
        setTimeout(function () {
          if (splash && mainWindow) {
            splash.hide();
            mainWindow.show();
          }
        }, 2000);
      });

      autoUpdater.on("update-available", () => {
        splash &&
          splash.webContents.send("updateStatus", "update available...");
        autoUpdater.downloadUpdate();
      });

      autoUpdater.on("download-progress", (progressObj) => {
        let message =
          "downloading update: " + progressObj.percent.toFixed(1) + "%";
        //message += ' (' + progressObj.transferred / 1000 + "k/" + progressObj.total + 'k)'
        splash && splash.webContents.send("updateStatus", message);
      });

      autoUpdater.on("update-downloaded", () => {
        splash &&
          splash.webContents.send(
            "updateStatus",
            "restarting & installing update..."
          );
        setTimeout(() => {
          autoUpdater.quitAndInstall();
        }, 2000);
      });

      autoUpdater.on("update-not-available", (_info) => {
        splash &&
          splash.webContents.send(
            "updateStatus",
            "version is up to date, launching app..."
          );
        setTimeout(() => {
          splash && splash.hide();
          mainWindow && mainWindow.show();
        }, 2000);
      });
    } else if (splash) {
      splash.webContents.send(
        "updateStatus",
        "automatic updates disabled. launching current version..."
      );
      setTimeout(() => {
        splash && splash.hide();
        mainWindow && mainWindow.show();
      }, 2000);
    }
  } catch (error) {
    console.log(error);
    logger(`${error}`);
  }
}
