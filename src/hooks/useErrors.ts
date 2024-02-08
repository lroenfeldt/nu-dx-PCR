import { ErrorType, IErrObj } from "../types/interfaces/useErrors";
import { IError } from "../types/interfaces/interfaces";
import { useData } from "./useData";
import { useTranslation } from "./useTranslation";
import { useEffect } from "react";

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
    [ErrorType.lid]: {
      code: 400,
      type: ErrorType.lid,
      message: t(""),
    },
    [ErrorType.read]: {
      code: 500,
      type: ErrorType.read,
      message: t(""),
    },
    [ErrorType.failedToReadTestData]: {
      code: 500,
      type: ErrorType.failedToReadTestData,
      message: t("errors.failedToReadTestData"),
    },
    [ErrorType.failedToReadResultData]: {
      code: 500,
      type: ErrorType.failedToReadResultData,
      message: t("errors.failedToReadResultData"),
    },
    [ErrorType.submit]: {
      code: 60012132,
      type: ErrorType.submit,
      message: t("errors.failedToSubmitResults"),
    },
    [ErrorType.failedToSaveControlSample]: {
      code: 600,
      type: ErrorType.failedToSaveControlSample,
      message: t("errors.failedToSaveControlSample"),
    },
    [ErrorType.failedToMoveSubmittedFiles]: {
      code: 600,
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
      message: t(""),
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
      code: 1000,
      type: ErrorType.offlineNotAllow,
      message: t("errors.checkInternetConnection"),
    },
    [ErrorType.stillOffline]: {
      code: 1000,
      type: ErrorType.stillOffline,
      message: t("common.stillOffline"),
    },
    [ErrorType.auth]: {
      code: 2000,
      type: ErrorType.auth,
      message: t("errors.deviceAuthenticationFailedRetry"),
    },
    [ErrorType.authentication]: {
      code: 2000,
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
      message: t(""),
    },
  };

  const registerErrors = (errorType: keyof typeof ErrorType) => {
    const errorObj = errorsHolder[errorType];
    if (errorObj) {
      setErrors((prevErrors: IError[]) =>
        prevErrors
          .filter((err) => err.type != errorType)
          .concat({ ...errorObj, timeStamp: Date.now() })
      );
    }
  };

  return { registerErrors };
}

export default useErrors;
