const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  getConfig: () => {
    return ipcRenderer.sendSync('getConfig');
  },
  saveConfig: (config) => {
    return ipcRenderer.invoke('saveConfig', config);
  },
  clearConfig: () => {
    return ipcRenderer.invoke('clearConfig');
  },
  checkResultFile: (testid) => {
    return ipcRenderer.sendSync('checkResultFile', testid);
  },
  moveResultFile: (testid) => {
    return ipcRenderer.sendSync('moveResultFile', testid);
  },
  getResult: (testid, testDone) => {
    return ipcRenderer.invoke('getResult', testid, testDone);
  },
  checkUSB: () => {
    return ipcRenderer.invoke('checkUSB');
  },
  saveToUSB: (testid, results) => {
    return ipcRenderer.invoke('saveToUSB', testid, results);
  },
  power: (reboot) => {
    return ipcRenderer.sendSync('power', reboot);
  },
  startLineGene: (testid, xmlContent, settings, barcodes, testmethod) => {
    return ipcRenderer.sendSync('startLineGene', testid, xmlContent, settings, barcodes, testmethod);
  },
  endLineGene: () => {
    return ipcRenderer.sendSync('endLineGene');
  },
  openLid: () => {
    return ipcRenderer.invoke('openLid');
  },
  moveFiles: (testid) => {
    return ipcRenderer.invoke('moveFiles', testid);
  },
  getVersion: () => {
    return ipcRenderer.invoke('getVersion');
  },
  updateStatus: (callback) => {
    return ipcRenderer.on('updateStatus', callback);
  },
  getUnsubmitted: () => {
    return ipcRenderer.invoke('getUnsubmitted');
  },
  getTests: () => {
    return ipcRenderer.invoke('getTests');
  },
  exit: () => {
    return ipcRenderer.invoke('exit');
  },
  logEvents: (message, logName) => {
    return ipcRenderer.invoke('log-Events', message, logName);
  },
  launchUpdates: () => {
    return ipcRenderer.invoke('launch-updates');
  },
  archiveRun: () => {
    return ipcRenderer.invoke('archiveRun');
  },

  downloadApp: () => {
    return ipcRenderer.invoke('downloadApp');
  },
  editResults: (testid, results) => {
    return ipcRenderer.invoke('editResults', testid, results);
  },
  deleteAllOverrides: () => {
    return ipcRenderer.invoke('deleteAllOverrides');
  },
  deleteOverride: (testid) => {
    return ipcRenderer.invoke('deleteOverride', testid);
  },
  relaunchApp: () => {
    return ipcRenderer.invoke('relaunchApp');
  },
});
