import { ipcMain } from "electron";
import { mainWindow, splash, store } from "../main";
import { autoUpdater } from "electron-updater";
import { logger } from "../logger";

export function launchUpdates() {
  ipcMain.handle("launch-updates", (_event) => updater());
}

export function updater() {
  /**
   * Check for updates and run the update
   * @returns {void}
   */

  console.log(store.get("settings").user.updateType === "beta");
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

    logger(`update failed: ${err}`, "logErrors");
    setTimeout(function () {
      if (splash && mainWindow) {
        splash.hide();
        mainWindow.show();
      }
    }, 2000);
  });
  autoUpdater.on("update-available", () => {
    splash && splash.webContents.send("updateStatus", "update available...");
  });
  autoUpdater.on("download-progress", (progressObj) => {
    let message = "downloading update: " + progressObj.percent.toFixed(1) + "%";
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
}

export function downloadUpdates(/* parameters */): void {
  // logic for downloading updates
  /**
   * Download the latest version of the app
   * @returns {void}
   * */
  ipcMain.handle("downloadApp", async (_event) => {
    autoUpdater.checkForUpdates();
    autoUpdater.downloadUpdate();
  });
}

// ... other update management functions can be added here
