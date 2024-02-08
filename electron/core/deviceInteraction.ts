import { app, ipcMain } from "electron";
import shutdown from "electron-shutdown-command";
import isDev from "electron-is-dev";
import * as fs from "fs";
import * as path from "path";
import { getDeviceType } from "../main";
import { logger } from "../createLogs/logger";
import macaddress from "macaddress";
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

export function toggleLid() {
  /**
   * Open Lid via Serial Port
   * */
  ipcMain.handle(
    "toggleLid",
    (_event: Electron.IpcMainInvokeEvent): boolean => {
      ("Signal to toggle lid received.");
      logger("Signal to toggle lid received.");
      const buffer: number[] = [
        0x7b, 0x7c, 0x0, 0x2, 0x4d, 0x1, 0x0, 0x4c, 0x7c, 0x7d,
      ];
      if (isDev) {
        return true;
      }
      let serialport = new SerialPort({
        path: "COM1",
        baudRate: 19200,
        parity: "none",
        autoOpen: false,
      });
      serialport.open((err?: Error | null) => {
        if (err) {
          console.log(
            "Error establishing serialport connection : " + err.message
          );
          logger(`Error establishing serialport connection : ${err.message}`);
          return false;
        }
        serialport.write(buffer, (err?: Error | null, result?: number) => {
          if (err) {
            console.log("Error while opening lid : " + err.message);
            logger(`Error while opening lid : ${err.message}`);
            return false;
          }
          if (result) {
            console.log("Response received after opening lid : " + result);
          }
          serialport.close((err?: Error | null) => {
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
    }
  );
}

export function checkUSB() {
  ipcMain.handle("checkUSB", (_event) => {
    if (isDev) {
      return true;
    }
    try {
      fs.accessSync("D:\\", fs.constants.F_OK);
      return true;
    } catch (err) {
      const errorMessage = "No Drive found or Drive not accessible";
      console.log(errorMessage);
      logger(errorMessage);
      return false;
    }
  });
}

export function saveToUSB() {
  //Save to USB
  ipcMain.handle("saveToUSB", (_event, testid, results) => {
    console.log(results);
    logger(JSON.stringify(results));
    const filename = testid + ".csv";
    const destPath = "D:\\nu-dx-pcr\\runs";
    const filepath = path.resolve(destPath, filename);
    try {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.writeFileSync(filepath, results);
    } catch (err: any) {
      console.error(err);
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

// move files from documents to runs/results/folder
export function moveMatchingFiles() {
  const documentsFolder = path.resolve(app.getPath("documents"));
  const runsFolder = path.resolve(app.getPath("userData"), "runs");
  try {
    const files = fs.readdirSync(documentsFolder);
    files.forEach((file) => {
      const fileName = path.parse(file).name;
      const sourceFile = path.join(documentsFolder, file);
      if (!fs.existsSync(sourceFile)) return;
      const resultsFiles = fs.readdirSync(runsFolder);
      // for mac because a file .DS_Store is in every folder
      const resultFile = resultsFiles.find(
        (folder) => fileName === folder && fileName !== ".DS_Store"
      );
      if (!resultFile) return;
      const targetFolder = path.join(runsFolder, resultFile);
      const targetPath = path.join(targetFolder, file);
      fs.renameSync(sourceFile, targetPath);
    });
  } catch (error) {
    console.log(error);
  }
}
