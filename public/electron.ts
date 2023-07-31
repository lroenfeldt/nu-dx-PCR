import * as DeviceUtils from './electron/deviceUtils';
import * as FileManagementUtils from './electron/fileManagementUtils';
import * as ResultFileOperations from './electron/resultFileOperations';
import * as DeviceOperations from './electron/deviceOperations';
import * as TestResultsUtils from './electron/testResultsUtils';
import * as TestManagementUtils from './electron/testManagementUtils';
import * as FileOperationUtils from './electron/fileOperationUtils';

DeviceUtils.getDeviceType();
DeviceUtils.createWindow();
DeviceUtils.createSplash();
DeviceUtils.whenReady();
DeviceUtils.on();

FileManagementUtils.ipcMainResult();
FileManagementUtils.ipcMainOnResultfile();
FileManagementUtils.ipcMainConfig();
FileManagementUtils.ipcMainGetConfig();

ResultFileOperations.ipcMainArchiveRun();
ResultFileOperations.ipcMainSaveConfig();
ResultFileOperations.ipcMainConfig();
ResultFileOperations.ipcMainClearConfig();
ResultFileOperations.ipcMainGetResult();

DeviceOperations.ipcMainOnPower();
DeviceOperations.ipcMainOnStartLineGene();
DeviceOperations.ipcMainStartLineGene();
DeviceOperations.ipcMainEndLineGene();
DeviceOperations.ipcMainToggleLid();

TestResultsUtils.ipcMainGetUnsubmitted();
TestResultsUtils.ipcMainGetTest();

TestManagementUtils.ipcMainMoveFiles();
TestManagementUtils.ipcMainSaveToUSB();
TestManagementUtils.ipcMainGetDeviceInfo();
TestManagementUtils.ipcMainGetVersion();
TestManagementUtils.ipcMainExit();
TestManagementUtils.ipcMainLogEvents();
TestManagementUtils.ipcMainLaunchUpdates();
TestManagementUtils.ipcMainDownloadApp();
TestManagementUtils.ipcMainEditResults();

FileOperationUtils.ipcMainDeleteAllOverrides();
FileOperationUtils.ipcMainDeleteOverride();
FileOperationUtils.ipcMainRelaunchApp();
FileOperationUtils.ipcMainCopyLogos();
