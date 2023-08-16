const { getDeviceType, createWindow, createSplash, whenReady, on } = require('./electron/deviceUtils.ts');
const {
  ipcMainResult,
  ipcMainOnResultfile,
  ipcMainConfig,
  ipcMainGetConfig,
} = require('./electron/fileManagementUtils');
const {
  ipcMainArchiveRun,
  ipcMainSaveConfig,
  ipcMainConfigs,
  ipcMainClearConfig,
  ipcMainGetResult,
} = require('./electron/resultFileOperations');
const {
  ipcMainOnPower,
  ipcMainOnStartLineGene,
  ipcMainStartLineGene,
  ipcMainEndLineGene,
  ipcMainToggleLid,
} = require('./electron/deviceOperations');
const { ipcMainGetUnsubmitted, ipcMainGetTest } = require('./electron/testResultsUtils');
const {
  ipcMainMoveFiles,
  ipcMainSaveToUSB,
  ipcMainGetDeviceInfo,
  ipcMainGetVersion,
  ipcMainExit,
  ipcMainLogEvents,
  ipcMainLaunchUpdates,
  ipcMainDownloadApp,
  ipcMainEditResults,
} = require('./electron/testManagementUtils');
const {
  ipcMainDeleteAllOverrides,
  ipcMainDeleteOverride,
  ipcMainRelaunchApp,
  ipcMainCopyLogos,
} = require('./electron/fileOperationUtils');

getDeviceType();
createWindow();
createSplash();
whenReady();
on();

ipcMainResult();
ipcMainOnResultfile();
ipcMainConfig();
ipcMainGetConfig();

ipcMainArchiveRun();
ipcMainSaveConfig();
ipcMainConfigs();
ipcMainClearConfig();
ipcMainGetResult();

ipcMainOnPower();
ipcMainOnStartLineGene();
ipcMainStartLineGene();
ipcMainEndLineGene();
ipcMainToggleLid();

ipcMainGetUnsubmitted();
ipcMainGetTest();

ipcMainMoveFiles();
ipcMainSaveToUSB();
ipcMainGetDeviceInfo();
ipcMainGetVersion();
ipcMainExit();
ipcMainLogEvents();
ipcMainLaunchUpdates();
ipcMainDownloadApp();
ipcMainEditResults();

ipcMainDeleteAllOverrides();
ipcMainDeleteOverride();
ipcMainRelaunchApp();
ipcMainCopyLogos();
