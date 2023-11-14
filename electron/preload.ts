import { contextBridge, ipcRenderer } from "electron";
import { CallbackType } from "./interfaces/interfaces";

contextBridge.exposeInMainWorld("api", {
  checkResultFile: (testid: string) =>
    ipcRenderer.invoke("checkResultFile", testid),
  moveResultFile: (testid: string) =>
    ipcRenderer.invoke("moveResultFile", testid),
  getConfig: () => ipcRenderer.sendSync("getConfig"),
  archiveRun: () => ipcRenderer.invoke("archiveRun"),
  saveConfig: (config: any) => ipcRenderer.invoke("saveConfig", config),
  clearConfig: () => ipcRenderer.invoke("clearConfig"),
  getResult: (testid: string, done: boolean) =>
    ipcRenderer.invoke("getResult", testid, done),
  toggleLid: () => ipcRenderer.invoke("toggleLid"),
  getUnsubmitted: () => ipcRenderer.invoke("getUnsubmitted"),
  getTests: () => ipcRenderer.invoke("getTests"),
  moveFiles: (testid: string) => ipcRenderer.invoke("moveFiles", testid),
  checkUSB: () => ipcRenderer.invoke("checkUSB"),
  saveToUSB: (testid: string, results: any) =>
    ipcRenderer.invoke("saveToUSB", testid, results),
  getDeviceInfo: () => ipcRenderer.invoke("getDeviceInfo"),
  getVersion: () => ipcRenderer.invoke("getVersion"),
  exit: () => ipcRenderer.invoke("exit"),
  downloadApp: () => ipcRenderer.invoke("downloadApp"),
  editResults: (testid: string, results: any) =>
    ipcRenderer.invoke("editResults", testid, results),
  deleteAllOverrides: () => ipcRenderer.invoke("deleteAllOverrides"),
  deleteOverride: (testid: string) =>
    ipcRenderer.invoke("deleteOverride", testid),
  relaunchApp: () => ipcRenderer.invoke("relaunchApp"),
  copyLogos: () => ipcRenderer.invoke("copyLogos"),
  logEvents: (message: string) => ipcRenderer.invoke("log-Events", message),
  startLineGene: (
    testid: string,
    xmlContent: string,
    settings: any,
    barcodes: any[],
    testmethod: string
  ) =>
    ipcRenderer.invoke(
      "startLineGene",
      testid,
      xmlContent,
      settings,
      barcodes,
      testmethod
    ),
  endLineGene: () => ipcRenderer.invoke("endLineGene"),
  power: (command: string) => ipcRenderer.send("power", command),
  updateStatus: (callback: CallbackType) => {
    return ipcRenderer.on("updateStatus", callback);
  },
  autoUpdate: (stateParameter: boolean) =>
    ipcRenderer.send("autoUpdate", stateParameter),
});
