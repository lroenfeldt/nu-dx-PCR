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
      code: 400,
      type: ErrorType.default,
      message: t("errors.errorOpenLidWhileRunning"),
    },
    [ErrorType.lid]: {
      code: 500,
      type: ErrorType.lid,
      message: t(`default.errors.${ErrorType.lid}`),
    },
    [ErrorType.read]: {
      code: 600,
      type: ErrorType.read,
      message: t("errors.failedToReadTestData"),
    },
    [ErrorType.failedToReadResultData]: {
      code: 601,
      type: ErrorType.failedToReadResultData,
      message: t("errors.failedToReadResultData"),
    },
    [ErrorType.submit]: {
      code: 700,
      type: ErrorType.submit,
      message: t("errors.failedToSubmitResults"),
    },
    [ErrorType.failedToSaveControlSample]: {
      code: 701,
      type: ErrorType.failedToSaveControlSample,
      message: t("errors.failedToSaveControlSample"),
    },
    [ErrorType.failedToMoveSubmittedFiles]: {
      code: 702,
      type: ErrorType.failedToMoveSubmittedFiles,
      message: t("errors.failedToMoveSubmittedFiles"),
    },
    [ErrorType.saveIntoUSB]: {
      code: 800,
      type: ErrorType.saveIntoUSB,
      message: t("errors.failedToSaveResultData"),
    },
    [ErrorType.dbCon]: {
      code: 900,
      type: ErrorType.dbCon,
      message: t("errors.dbConnectionError"),
    },
    [ErrorType.dbConnection]: {
      code: 901,
      type: ErrorType.dbConnection,
      message: t("errors.checkTestSampleFail"),
    },
    [ErrorType.checkInternetConnection]: {
      code: 1000,
      type: ErrorType.checkInternetConnection,
      message: t("errors.checkInternetConnection"),
    },
    [ErrorType.pairingDbError]: {
      code: 1001,
      type: ErrorType.pairingDbError,
      message: t("errors.pairingDbError"),
    },
    [ErrorType.deviceRegistrationFailed]: {
      code: 1002,
      type: ErrorType.deviceRegistrationFailed,
      message: t("errors.deviceRegistrationFailed"),
    },
    [ErrorType.offline]: {
      code: 2000,
      type: ErrorType.offline,
      message: t("errors.deviceAuthenticationFailedZeroRemDays"),
    },
    [ErrorType.offlineNotAllow]: {
      code: 2001,
      type: ErrorType.offlineNotAllow,
      message: t("errors.checkInternetConnection"),
    },
    [ErrorType.stillOffline]: {
      code: 2002,
      type: ErrorType.stillOffline,
      message: t("common.stillOffline"),
    },
    [ErrorType.auth]: {
      code: 3000,
      type: ErrorType.auth,
      message: t("errors.deviceAuthenticationFailedRetry"),
    },
    [ErrorType.authentication]: {
      code: 3001,
      type: ErrorType.authentication,
      message: t("errors.deviceAuthenticationFailedRetry"),
    },
    [ErrorType.init]: {
      code: 4000,
      type: ErrorType.init,
      message: t("errors.deviceInitializationFailed"),
    },
    [ErrorType.cancelTest]: {
      code: 5000,
      type: ErrorType.cancelTest,
      message: t("runTest.cancelTest"),
    },
    [ErrorType.testFailed]: {
      code: 6000,
      type: ErrorType.testFailed,
      message: t("errors.testFailed"),
    },
    [ErrorType.startTest]: {
      code: 7000,
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
      window.api.logEvents(errorsHolder[errorType].message);
      console.log(errorsHolder[errorType].message);
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
