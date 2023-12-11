import { app, BrowserWindow } from "electron";
import path from "path";
import fs from "fs";
import Store from "electron-store";
import isDev from "electron-is-dev";
import AutoLaunch from "auto-launch";
import { spawn } from "./logs/spawn";
import { logger } from "./logs/logger";
import { IStore } from "./interfaces/interfaces";
import {
  downloadUpdates,
  launchUpdates,
  updater,
} from "./core/updateManagement";
import {
  checkResultFileHandler,
  getResultHandler,
  getVersion,
  moveResultFileHandler,
} from "./core/ipcHandlers";
import { clearConfig, getConfig, saveConfig } from "./core/configFile";
import {
  archiveRun,
  deleteAllOverrides,
  deleteOverride,
  moveFiles,
} from "./core/fileOperations";
import {
  checkAndSaveToUSB,
  checkUSB,
  getDeviceInfo,
  rebootDevice,
  toggleLid,
} from "./core/deviceInteraction";
import {
  editResultsHandler,
  endTest,
  getTests,
  getUnsubmitted,
  startTest,
} from "./core/testManagement";
import { exit, relaunchApp } from "./core/lifecycleManagement";
import { copyLogos } from "./core/utilities";
import { deleteLogs } from "./logs/deleteLogs";
import { logError } from "./core/logging";
import { createFile } from "./logs/createFile";

export let mainWindow: BrowserWindow | undefined;
export let splash: BrowserWindow | undefined;
export let lineGenePath: string;
process.env.DIST = path.join(__dirname, "../dist-electron");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");
export const killProcess = (process: string) => {
  spawn("taskkill", ["/f", "/im", process]);
};

/**
 * check installed version of LineGene
 * @returns {string} the version of LineGene
 */
const softwareList = [
  {
    path: "C:\\Bioer\\LineGene\\1600\\bin\\LineGene1600.exe",
    returnType: 16,
    name: "LineGene1600",
  },
  {
    path: "C:\\Bioer\\LineGene1600 for research\\1644\\bin\\LineGene1600.exe",
    returnType: 16,
    name: "LineGene1644",
  },
  {
    path: "C:\\BIOER\\LineGene1600 for research\\1640\\bin\\LineGene1600.exe",
    returnType: 16,
    name: "LineGene1640",
  },
  {
    path: "C:\\BIOER\\96\\bin\\Gene-9660.exe",
    returnType: 96,
    name: "LineGene9600",
  },
];
/**
 *
 * @returns number
 */
export const getDeviceType = () => {
  if (isDev) return 16;
  for (let i = 0; i < softwareList.length; i++) {
    const software = softwareList[i];

    try {
      const res = fs.realpathSync(software.path);
      fs.accessSync(res, fs.constants.F_OK);

      lineGenePath = res;
      return software.returnType;
    } catch (error) {
      console.log(`${software.name} not found`);
      logger(`${software.name} not found`);
      return 0;
    }
  }

  const errMessage = "No LineGene Installation found";
  console.log(errMessage);
  logger(errMessage);

  return 0;
};

/**
 * Default configuration
 *  @type {string}
 */
export const store = new Store<IStore>({
  defaults: {
    settings: {
      account: {
        initialized: false,
        authToken: "",
        maxBarcodeLength: 10,
        minBarcodeLength: 9,
        allowedCharacters: "1234567890",
        orderKey: "A210176",
        autoControl: true,
        hecThreshFL: 100,
        virusThreshFL: 300,
        checkBarcodesDB: true,
        checkOrder: true,
        submitRunSetup: true,
        showResults: false,
        submitResults: true,
        autoSubmitUnsubmitted: false,
        customCheckBarcodesEndpoint: "",
        customSubmitRunSetupEndpoint: "",
        customSubmitAutoControlEndpoint: "",
        customFetchAutoControlEndpoint: "",
        customSubmitResultsEndpoint: "",
        data: {
          id: "fbdaac7d-4055-4b30-9f64-d0070447eca7",
          profileId: "cef5b173-f8dc-494e-8ce0-62938441ae01",
          name: "nu:dx PCR",
          email: "l.roenfeldt@procomcure.de",
          lastSignIn: "2022-06-03T08:52:07.302061Z",
          authenticated: true,
          contactPerson: "Leif Rönfeldt",
          address: "tbd",
          emailConfirmedAt: "2022-05-23T10:03:44.944231Z",
          role: {
            name: "poc-customer",
            isAdmin: true,
          },
        },
      },
      user: {
        tpcPos: "A01",
        ntcPos: "A02",
        locale: "en",
        updateType: "stable",
      },
    },
  },
});

/**
 * Create and configure the browser window.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    title: "nu:dx PCR",
    icon: path.join(process.env.PUBLIC, "favicon.ico"),
    width: 1280,
    height: 800,
    resizable: isDev,
    fullscreen: !isDev,
    alwaysOnTop: false, // !isDev
    backgroundColor: "#000000",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      webSecurity: false,
      contextIsolation: true,
    },
  });

  mainWindow.on("show", () => {
    setTimeout(() => {
      if (mainWindow) mainWindow.focus();
    }, 2000);
  });

  mainWindow.once("ready-to-show", () => {
    if (mainWindow) mainWindow.setMenuBarVisibility(isDev);

    if (isDev) {
      if (splash)
        splash.webContents.send(
          "updateStatus",
          "launching in development mode..."
        );
      setTimeout(function () {
        if (splash && mainWindow) {
          splash.hide();
          mainWindow.show();
        }
      }, 2000);
    }
  });

  mainWindow.on("closed", () => {
    ["Gene-9660.exe", "LineGene1600.exe", "PcrServer.exe"].forEach(killProcess);
    app.quit();
  });
  const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

  if (!fs.existsSync(path.join(__dirname, "../dist-electron"))) {
    setTimeout(() => {
      if (splash)
        splash.webContents.send(
          "updateStatus",
          "launching in development mode..."
        );
    }, 2000);
  }
  mainWindow.loadURL(
    isDev && VITE_DEV_SERVER_URL
      ? VITE_DEV_SERVER_URL
      : path.join(process.env.DIST, "index.html")
  );
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach", activate: true });
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
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      webSecurity: false,
      contextIsolation: true,
    },
  };

  splash = new BrowserWindow(splashConfig);

  // Load the splash content if the file exists.
  const splashFilePath = path.join(__dirname, "../splash.html");

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
  createFile();
  deleteLogs();

  spawn("taskkill", ["/f", "/im", "PcrServer.exe"]);

  //Launch app on startup
  let autoLaunch = new AutoLaunch({
    name: "nu:dx PCR",
    path: app.getPath("exe"),
  });
  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled && !isDev) autoLaunch.enable();
  });

  updater();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  ["Gene-9660.exe", "LineGene1600.exe", "PcrServer.exe"].forEach(killProcess);
  app.quit();
});

checkResultFileHandler();
moveResultFileHandler();

getConfig();

archiveRun();

saveConfig();
clearConfig();

getResultHandler();

rebootDevice();

startTest();
endTest();

toggleLid();

getUnsubmitted();

getTests();
moveFiles();

checkUSB();
checkAndSaveToUSB();
getDeviceInfo();

getVersion();
logError();

launchUpdates();
updater();
downloadUpdates();

deleteAllOverrides();

deleteOverride();

relaunchApp();
copyLogos();
editResultsHandler();
exit();
