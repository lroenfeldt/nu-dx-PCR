import { v4 as uuid } from "uuid";

export const errorProps = {
  moveResults: { code: 100, name: "moveResults", id: uuid() },
  stillOffline: { code: 200, name: "stillOffline", id: uuid() },
  settings: { code: 300, name: "settings", id: uuid() },
  saveSettings: { code: 400, name: "saveSettings", id: uuid() },
  default: { code: 500, name: "default", id: uuid() },
  lid: { code: 600, name: "lid", id: uuid() },
  read: { code: 700, name: "read", id: uuid() },
  submit: { code: 800, name: "submit", id: uuid() },
  saveToUSB: { code: 900, name: "saveToUSB", id: uuid() },
  dbCon: { code: 1000, name: "dbCon", id: uuid() },
  pairing: { code: 2000, name: "pairing", id: uuid() },
  auth: { code: 2000, name: "auth", id: uuid() },
  offlineNotAllow: { code: 3000, name: "offlineNotAllow", id: uuid() },
  offline: { code: 4000, name: "offline", id: uuid() },
  init: { code: 5000, name: "init", id: uuid() },
  cancelTest: { code: 6000, name: "cancelTest", id: uuid() },
  testFailed: { code: 7000, name: "testFailed", id: uuid() },
  startTest: { code: 8000, name: "startTest", id: uuid() },
};
