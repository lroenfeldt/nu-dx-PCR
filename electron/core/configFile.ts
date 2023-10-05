import { app, ipcMain } from "electron";
import { getDeviceType, store } from "../main";
import isDev from "electron-is-dev";
import macaddress from "macaddress";
import { logger } from "../logger";

export async function getConfig(): Promise<void> {
  //fetch config from config.json and hardware
  ipcMain.on("getConfig", async (event) => {
    let settings = store.get("settings");
    let wellCount = getDeviceType();
    settings.isDev = isDev;
    settings.version = app.getVersion();
    let hardwareId = await macaddress.one().then((mac) => mac);
    let serialNumber = ""; // await getSerialNumber();
    settings.device = { hardwareId, wellCount, serialNumber };
    event.returnValue = settings;
  });
}

export function saveConfig(): void {
  //save config to config.json
  ipcMain.handle("saveConfig", async (_event, config) => {
    try {
      store.set("settings", config);
      return true;
    } catch (err) {
      console.error(err);
      logger(`saveConfig ${err}`, "logErrors");
      throw Error("Settings could not be saved");
    }
  });
}

export function clearConfig(): void {
  //reset config.json to defaults
  ipcMain.handle("clearConfig", async (_event) => {
    try {
      store.clear();
      return true;
    } catch (err) {
      console.error(err);
      logger(`clearConfig ${err}`, "logErrors");
      throw Error("Settings could not be saved");
    }
  });
}
