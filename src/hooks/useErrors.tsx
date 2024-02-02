import { IErrObject, IError } from "../types/interfaces/interfaces";
import { useData } from "./useData";
import { useTranslation } from "./useTranslation";

export function useErrors() {
  const { t } = useTranslation();
  const { setErrors } = useData();

  // errType entfällt
  function registerErrors(errObject: IErrObject) {
    setErrors((prevErrors: IError[]) =>
      prevErrors
        .filter((err) => err.type != errObject.type)
        .concat({ ...errObject, timeStamp: Date.now() })
    );
  }

  const moveResults = {
    code: 100,
    type: "moveResults",
    message: t("errors.failedToMoveResults"),
  };

  const setting = {
    code: 300,
    type: "setting",
    message: t("errors.failedTosaveSettings"),
  };

  const lid = {
    code: 400,
    type: "lid",
  };

  const read = {
    code: 500,
    type: "read",
  };

  const failedToReadTestData = {
    code: 500,
    type: "failedToReadTestData",
    message: t("errors.failedToReadTestData"),
  };

  const failedToReadResultData = {
    code: 500,
    type: "failedToReadResultData",
    message: t("errors.failedToReadResultData"),
  };

  const submit = {
    code: 600,
    type: "submit",
    message: t("errors.failedToSubmitResults"),
  };

  const failedToSaveControlSample = {
    code: 600,
    type: "failedToSaveControlSample",
    message: t("errors.failedToSaveControlSample"),
  };

  const failedToMoveSubmittedFiles = {
    code: 600,
    type: "failedToMoveSubmittedFiles",
    message: t("errors.failedToMoveSubmittedFiles"),
  };

  const saveIntoUSB = {
    code: 700,
    type: "saveIntoUSB",
    message: t("errors.failedToSaveResultData"),
  };

  const dbCon = {
    code: 800,
    type: "dbCon",
  };

  const checkInternetConnection = {
    code: 900,
    type: "checkInternetConnection",
    message: t("errors.checkInternetConnection"),
  };

  const pairingDbError = {
    code: 900,
    type: "pairingDbError",
    message: t("errors.pairingDbError"),
  };

  const deviceRegistrationFailed = {
    code: 900,
    type: "deviceRegistrationFailed",
    message: t("errors.deviceRegistrationFailed"),
  };

  const offline = {
    code: 1000,
    type: "offline",
    message: t("errors.deviceAuthenticationFailedZeroRemDays"),
  };

  const offlineNotAllow = {
    code: 1000,
    type: "offlineNotAllow",
    message: t("errors.checkInternetConnection"),
  };

  const stillOffline = {
    code: 1000,
    type: "stillOffline",
    message: t("common.stillOffline"),
  };

  const auth = {
    code: 2000,
    type: "auth",
    message: t("errors.deviceAuthenticationFailedRetry"),
  };
  const authentication = {
    code: 2000,
    type: "authentication",
    message: t("errors.deviceAuthenticationFailedRetry"),
  };

  const init = {
    code: 3000,
    type: "init",
    message: t("errors.deviceInitializationFailed"),
  };

  const cancelTest = {
    code: 4000,
    type: "cancelTest",
    message: t("runTest.cancelTest"),
  };

  const testFailed = {
    code: 5000,
    type: "testFailed",
    message: t("errors.testFailed"),
  };

  const startTest = {
    code: 6000,
    type: "startTest",
  };

  return {
    // register function
    registerErrors,
    // Error props
    moveResults,
    stillOffline,
    setting,
    lid,
    failedToReadTestData,
    failedToReadResultData,
    read,
    failedToSaveControlSample,
    submit,
    failedToMoveSubmittedFiles,
    saveIntoUSB,
    dbCon,
    checkInternetConnection,
    pairingDbError,
    deviceRegistrationFailed,
    offline,
    auth,
    authentication,
    offlineNotAllow,
    init,
    cancelTest,
    testFailed,
    startTest,
  };
}
