import { ipcMain } from "electron";
import shutdown from "electron-shutdown-command";
import { logger } from "../logger";
import isDev from "electron-is-dev";
import fs from "fs";
import path from "path";
import macaddress from "macaddress";
import { getDeviceType } from "../main";
const { SerialPort } = require("serialport");

export function rebootDevice(): void {
  /**
   * Reboot the device
   * @returns {Boolean} true if reboot successful
   * */
  ipcMain.on("power", (event, reboot) => {
    if (reboot === "reboot") {
      shutdown.reboot({ force: true });
    } else {
      shutdown.shutdown({ force: true });
    }
    event.returnValue = true;
  });
}

export function toggleLid(): void {
  /**
   * Open Lid via Serial Port
   * */
  ipcMain.handle("toggleLid", (event: Electron.IpcMainInvokeEvent): boolean => {
    console.log("Signal to toggle lid received.");
    logger("Signal to toggle lid received.");

    const buffer: number[] = [
      0x7b, 0x7c, 0x0, 0x2, 0x4d, 0x1, 0x0, 0x4c, 0x7c, 0x7d,
    ];
    if (isDev) {
      return true;
    }

    SerialPort.open((err?: Error | null) => {
      if (err) {
        console.log(
          "Error establishing serialport connection : " + err.message
        );
        logger(`Error establishing serialport connection : ${err.message}`);
        return false;
      }
      SerialPort.write(buffer, (err?: Error | null, result?: number) => {
        if (err) {
          console.log("Error while opening lid : " + err.message);
          logger(`Error while opening lid : ${err.message}`);
          return false;
        }
        if (result) {
          console.log("Response received after opening lid : " + result);
        }
        SerialPort.close((err?: Error | null) => {
          if (err) {
            console.log(
              "Error while closing serialport connection : " + err.message
            );
            logger(
              `Error while closing serialport connection : ${err.message}`
            );
            return false;
          }
        });
      });
    });

    return true;
  });
}

export function checkUSB(): void {
  /**
   * check if USB is connected
   * @returns {boolean}
   * */
  ipcMain.handle("checkUSB", (event) => {
    if (isDev) {
      return true;
    }

    try {
      fs.accessSync("D:\\", fs.constants.F_OK);
      return true;
    } catch (err) {
      console.log("No Drive found or Drive not accessible");
      logger("No Drive found or Drive not accessible");
      //console.log(err)
      return false;
    }
  });
}

export function saveToUSB(): void {
  //Save to USB
  ipcMain.handle("saveToUSB", (event, testid, results) => {
    console.log(results);
    logger(JSON.stringify(results));
    const filename = testid + ".csv";
    const destPath = "D:\\nu-dx-pcr\\runs";
    const filepath = path.resolve(destPath, filename);
    try {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.writeFileSync(filepath, results);
    } catch (err: any) {
      console.log(err);
      logger(err);
      logger(`saveToUSB: ${err}`);
      throw err;
    }
    return true;
  });
}

export function getDeviceInfo() {
  /**
   * Get Device Infos
   * @returns {object}  { hardwareId, deviceType, serialNumber }
   * */
  ipcMain.handle("getDeviceInfo", async (_event) => {
    try {
      let hardwareId = await macaddress.one().then((mac) => mac);
      let serialNumber = ""; //await getSerialNumber();
      let deviceType = getDeviceType();
      return { hardwareId, deviceType, serialNumber };
    } catch (err) {
      console.error(err);
      logger(`getDeviceInfo: ${err}`);
      throw err;
    }
  });
}
