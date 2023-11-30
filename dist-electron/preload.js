"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  checkResultFile: (testid) => electron.ipcRenderer.invoke("checkResultFile", testid),
  moveResultFile: (testid) => electron.ipcRenderer.invoke("moveResultFile", testid),
  getConfig: () => electron.ipcRenderer.sendSync("getConfig"),
  archiveRun: () => electron.ipcRenderer.invoke("archiveRun"),
  saveConfig: (config) => electron.ipcRenderer.invoke("saveConfig", config),
  clearConfig: () => electron.ipcRenderer.invoke("clearConfig"),
  getResult: (testid, done) => electron.ipcRenderer.invoke("getResult", testid, done),
  toggleLid: () => electron.ipcRenderer.invoke("toggleLid"),
  getUnsubmitted: () => electron.ipcRenderer.invoke("getUnsubmitted"),
  getTests: () => electron.ipcRenderer.invoke("getTests"),
  moveFiles: (testid) => electron.ipcRenderer.invoke("moveFiles", testid),
  checkUSB: () => electron.ipcRenderer.invoke("checkUSB"),
  saveToUSB: (testid, results) => electron.ipcRenderer.invoke("saveToUSB", testid, results),
  getDeviceInfo: () => electron.ipcRenderer.invoke("getDeviceInfo"),
  getVersion: () => electron.ipcRenderer.invoke("getVersion"),
  exit: () => electron.ipcRenderer.invoke("exit"),
  downloadApp: () => electron.ipcRenderer.invoke("downloadApp"),
  editResults: (testid, results) => electron.ipcRenderer.invoke("editResults", testid, results),
  deleteAllOverrides: () => electron.ipcRenderer.invoke("deleteAllOverrides"),
  deleteOverride: (testid) => electron.ipcRenderer.invoke("deleteOverride", testid),
  relaunchApp: () => electron.ipcRenderer.invoke("relaunchApp"),
  copyLogos: () => electron.ipcRenderer.invoke("copyLogos"),
  logEvents: (message) => electron.ipcRenderer.invoke("log-Events", message),
  startLineGene: (testid, xmlContent, settings, barcodes, testmethod) => electron.ipcRenderer.invoke(
    "startLineGene",
    testid,
    xmlContent,
    settings,
    barcodes,
    testmethod
  ),
  endLineGene: () => electron.ipcRenderer.invoke("endLineGene"),
  power: (command) => electron.ipcRenderer.send("power", command)
});
