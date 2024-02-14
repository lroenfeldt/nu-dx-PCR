import { ErrorType, IErrObj } from "../types/interfaces/useErrors";
import { IError } from "../types/interfaces/interfaces";
import { useData } from "./useData";
import { useTranslation } from "./useTranslation";
import { useCallback } from "react";

function useErrors() {
  const { t } = useTranslation();
  const { setErrors, errors } = useData();

  const errorsHolder: Record<ErrorType, IErrObj> = {
    [ErrorType.moveResults]: {
      code: 100,
      type: ErrorType.moveResults,
      message: t("errors.failedToMoveResults"),
    },
    [ErrorType.setting]: {
      code: 300,
      type: ErrorType.setting,
      message: t("errors.failedTosaveSettings"),
    },
    [ErrorType.default]: {
      code: 300,
      type: ErrorType.default,
      message: t("default.errors.errorOpenLidWhileRunning"),
    },
    [ErrorType.lid]: {
      code: 400,
      type: ErrorType.lid,
      message: t(`default.errors.${ErrorType.lid}`),
    },
    [ErrorType.read]: {
      code: 500,
      type: ErrorType.read,
      message: t(""),
    },
    [ErrorType.failedToReadTestData]: {
      code: 501,
      type: ErrorType.failedToReadTestData,
      message: t("errors.failedToReadTestData"),
    },
    [ErrorType.failedToReadResultData]: {
      code: 502,
      type: ErrorType.failedToReadResultData,
      message: t("errors.failedToReadResultData"),
    },
    [ErrorType.submit]: {
      code: 600,
      type: ErrorType.submit,
      message: t("errors.failedToSubmitResults"),
    },
    [ErrorType.failedToSaveControlSample]: {
      code: 601,
      type: ErrorType.failedToSaveControlSample,
      message: t("errors.failedToSaveControlSample"),
    },
    [ErrorType.failedToMoveSubmittedFiles]: {
      code: 602,
      type: ErrorType.failedToMoveSubmittedFiles,
      message: t("errors.failedToMoveSubmittedFiles"),
    },
    [ErrorType.saveIntoUSB]: {
      code: 700,
      type: ErrorType.saveIntoUSB,
      message: t("errors.failedToSaveResultData"),
    },
    [ErrorType.dbCon]: {
      code: 800,
      type: ErrorType.dbCon,
      message: t("errors.dbConnectionError"),
    },
    [ErrorType.dbConnection]: {
      code: 800,
      type: ErrorType.dbConnection,
      message: t("errors.checkTestSampleFail"),
    },
    [ErrorType.checkInternetConnection]: {
      code: 900,
      type: ErrorType.checkInternetConnection,
      message: t("errors.checkInternetConnection"),
    },
    [ErrorType.pairingDbError]: {
      code: 900,
      type: ErrorType.pairingDbError,
      message: t("errors.pairingDbError"),
    },
    [ErrorType.deviceRegistrationFailed]: {
      code: 900,
      type: ErrorType.deviceRegistrationFailed,
      message: t("errors.deviceRegistrationFailed"),
    },
    [ErrorType.offline]: {
      code: 1000,
      type: ErrorType.offline,
      message: t("errors.deviceAuthenticationFailedZeroRemDays"),
    },
    [ErrorType.offlineNotAllow]: {
      code: 1001,
      type: ErrorType.offlineNotAllow,
      message: t("errors.checkInternetConnection"),
    },
    [ErrorType.stillOffline]: {
      code: 1002,
      type: ErrorType.stillOffline,
      message: t("common.stillOffline"),
    },
    [ErrorType.auth]: {
      code: 2000,
      type: ErrorType.auth,
      message: t("errors.deviceAuthenticationFailedRetry"),
    },
    [ErrorType.authentication]: {
      code: 2001,
      type: ErrorType.authentication,
      message: t("errors.deviceAuthenticationFailedRetry"),
    },
    [ErrorType.init]: {
      code: 3000,
      type: ErrorType.init,
      message: t("errors.deviceInitializationFailed"),
    },
    [ErrorType.cancelTest]: {
      code: 4000,
      type: ErrorType.cancelTest,
      message: t("runTest.cancelTest"),
    },
    [ErrorType.testFailed]: {
      code: 5000,
      type: ErrorType.testFailed,
      message: t("errors.testFailed"),
    },
    [ErrorType.startTest]: {
      code: 6000,
      type: ErrorType.startTest,
      message: t("errors.failtedToStartTest"),
    },
  };

  const registerErrors = useCallback(
    (errorType: keyof typeof ErrorType) => {
      setErrors((prevErrors: IError[]) =>
        prevErrors
          .filter((err) => err.type != errorType)
          .concat({ ...errorsHolder[errorType], timeStamp: Date.now() })
      );
    },
    [errors]
  );

  const clearErrors = useCallback(
    (errorType: keyof typeof ErrorType) => {
      setErrors((prevErrors: IError[]) =>
        prevErrors.filter((err) => err.type != errorType)
      );
    },
    [errors]
  );

  return { registerErrors, clearErrors };
}

export default useErrors;
