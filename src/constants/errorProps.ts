import { t } from "i18n-js";

export const errorProps = {
  moveResults: {
    code: 100,
    type: "moveResults",
    message: t("errors.failedToMoveResults"),
  },
  stillOffline: {
    code: 200,
    type: "stillOffline",
    message: t("common.stillOffline"),
  },
  settings: {
    code: 300,
    type: "settings",
    message: t("errors.failedTosaveSettings"),
  },
  saveSettings: {
    code: 400,
    type: "saveSettings",
    message: t("errors.failedTosaveSettings"),
  },
  default: {
    code: 500,
    type: "default",
    message: t("default.errors.errorOpenLidWhileRunning"),
  },
  lid: { code: 600, type: "lid" },
  failedToReadTestData: {
    code: 700,
    type: "failedToReadTestData",
    message: t("errors.failedToReadTestData"),
  },
  failedToReadResultData: {
    code: 800,
    type: "failedToReadResultData",
    message: t("errors.failedToReadResultData"),
  },
  read: { code: 900, type: "read" },
  failedToSaveControlSample: {
    code: 1000,
    type: "failedToSaveControlSample",
    message: t("errors.failedToSaveControlSample"),
  },
  submit: {
    code: 1000,
    type: "submit",
    message: t("errors.failedToSubmitResults"),
  },
  failedToMoveSubmittedFiles: {
    code: 1000,
    type: "failedToSaveControlSample",
    message: t("errors.failedToMoveSubmittedFiles"),
  },
  saveToUSB: {
    code: 2000,
    type: "saveToUSB",
    message: t("errors.failedToSaveResultData"),
  },
  dbCon: { code: 1000, type: "dbCon" },
  checkInternetConnection: {
    code: 2000,
    type: "checkInternetConnection",
    message: t("errors.checkInternetConnection"),
  },
  pairingDbError: {
    code: 2000,
    type: "pairingDbError",
    message: t("errors.pairingDbError"),
  },
  deviceRegistrationFailed: {
    code: 2000,
    type: "deviceRegistrationFailed",
    message: t("errors.deviceRegistrationFailed"),
  },
  deviceAuthenticationFailedZeroRemDays: {
    code: 2000,
    type: "deviceAuthenticationFailedZeroRemDays",
    message: t("errors.deviceAuthenticationFailedZeroRemDays"),
  },
  auth: {
    code: 2000,
    type: "auth",
    message: t("errors.deviceAuthenticationFailedRetry"),
  },
  offlineNotAllow: {
    code: 3000,
    type: "offlineNotAllow",
    message: t("errors.checkInternetConnection"),
  },
  init: {
    code: 5000,
    type: "init",
    message: t("errors.deviceInitializationFailed"),
  },
  cancelTest: {
    code: 6000,
    type: "cancelTest",
    message: t("runTest.cancelTest"),
  },
  testFailed: {
    code: 7000,
    type: "testFailed",
    message: t("errors.testFailed"),
  },
  startTest: { code: 8000, type: "startTest" },
};
