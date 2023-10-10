import React, { useCallback } from "react";
import { useData, useResults, useTranslation } from "../hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { IError } from "../types/interfaces/interfaces";
import { IHideErrorProps } from "../types/components";
import { errorProps } from "src/constants/errorProps";

const Errors: React.FC = () => {
  const {
    setOfflineMode,
    reboot,
    errors,
    reset,
    testid,
    setDeviceStatus,
    setErrors,
  } = useData();
  const { submitResult } = useResults();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const startTest = useCallback(() => {
    navigate("/runTest");
  }, [navigate]);
  const hideError = ({ type, index, remember }: IHideErrorProps) => {
    if (type)
      setErrors((prevErrors: IError[]) =>
        prevErrors.filter((error) => error.type !== type)
      );
    if (remember) setOfflineMode(true);
    if (index || index == 0)
      setErrors((prevErrors: IError[]) =>
        prevErrors.filter((error, errIndex) => errIndex != index)
      );
  };
  const cancelTest = () => {
    setErrors((prevErrors: IError[]) =>
      prevErrors.filter((error) => error.type !== "cancelTest")
    );
    navigate("/selectMethod");
    window.api.endLineGene();
    setDeviceStatus("IDLE");
  };
  const launchOffline = () => {
    setErrors(errors.filter((e) => e.type != "offline"));
    navigate("/selectMethod");
    setOfflineMode(true);
  };
  const activateOffline = (errIndex: number) => {
    setOfflineMode(true);
    hideError({ index: errIndex });
  };
  const handleReadError = useCallback(
    (errIndex: number) => {
      reset();
      hideError({ index: errIndex });
      if (location.pathname === "/uploadResults") {
        navigate("/selectMethod");
      } else {
        navigate("/ResultList");
      }
    },
    [reset, hideError]
  );

  const ErrorsType1 = ["pairing", "auth", "init"];
  const ErrorsType2 = ["stillOffline", "invalid", "testFailed"];
  return (
    <div className="errorContainer">
      {errors.map((error, i) => {
        if (ErrorsType1.includes(error.type)) {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>

              <button
                onClick={() => {
                  if (error.type === "pairing") {
                    navigate("/pairing");
                  } else {
                    window.location.reload();
                    hideError({ index: i });
                  }
                }}
              >
                {t("common.retry")}
              </button>

              <button onClick={() => reboot()}>{t("common.reboot")}</button>
            </div>
          );
        }
        if (error.type === "lid") {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => reboot()}>{t("common.reboot")}</button>
              <button onClick={() => hideError({ index: i })}>
                {t("common.close")}
              </button>
            </div>
          );
        }

        if (error.type === "offline") {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              {
                <button
                  onClick={() => {
                    window.location.reload();
                    hideError({ index: i });
                  }}
                >
                  {t("common.retry")}
                </button>
              }
              {
                <button onClick={() => launchOffline()}>
                  {t("common.offlineMode")}
                </button>
              }
            </div>
          );
        }
        if (error.type === "submit") {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button
                onClick={() => {
                  hideError({ index: i });
                  setTimeout(() => {
                    submitResult(testid, false);
                  }, 3000);
                }}
              >
                {t("common.retry")}
              </button>
              {/* <button onClick={() => activateOffline(i)}>
                {t("common.offline")}
              </button> */}
              <button
                onClick={() => {
                  hideError({ index: i });
                  // navigate("/selectMethod");
                }}
              >
                {t("common.close")}
              </button>
            </div>
          );
        }
        if (ErrorsType2.includes(error.type)) {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button
                onClick={() => {
                  hideError({ index: i });
                  if (error.type == "testFailed") {
                    navigate("/selectMethod");
                  }
                }}
              >
                {t("common.close")}
              </button>
            </div>
          );
        }
        if (error.type === "moveResults") {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button
                onClick={() => {
                  hideError({ index: i });
                  setTimeout(() => {
                    if (!window.api.moveResultFile(testid)) {
                      window.api.logEvents(
                        `Result for test ${testid} could not be moved`
                      );
                      setErrors((prevErrors: IError[]) =>
                        prevErrors
                          .filter((err) => err.type != "moveResults")
                          .concat({
                            code: errorProps.moveResults.code,
                            id: errorProps.moveResults.id,
                            type: "moveResults",
                            message: t("errors.failedToMoveResults"),
                          })
                      );
                    } else {
                      window.api.logEvents(`attempting to move result file`);
                      setTimeout(() => {
                        navigate("/uploadResults");
                      }, 2000);
                    }
                  }, 1000);
                }}
              >
                {t("common.retry")}
              </button>
              <button
                onClick={() => {
                  reset();
                  navigate("/selectMethod");
                }}
              >
                {t("common.cancel")}
              </button>
            </div>
          );
        }
        if (error.type === "cancelTest") {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button
                onClick={() => {
                  cancelTest();
                  reboot();
                }}
              >
                {t("common.testAbort") + " & " + t("common.reboot")}
              </button>
              <button onClick={() => hideError({ type: "cancelTest" })}>
                {t("common.testResume")}
              </button>
            </div>
          );
        }
        if (error.type === "startTest") {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => startTest()}>{t("common.retry")}</button>
              <button
                onClick={() => {
                  reset();
                  navigate("/selectMethod");
                }}
              >
                {t("common.cancel")}
              </button>
            </div>
          );
        }
        if (error.type === "read") {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => handleReadError(i)}>
                {t("common.close")}
              </button>
            </div>
          );
        }
        if (error.type === "dbCon") {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              {
                <button
                  onClick={() => {
                    window.location.reload();
                    hideError({ index: i });
                  }}
                >
                  {t("common.retry")}
                </button>
              }
              <button onClick={() => hideError({ index: i, remember: true })}>
                {t("common.offlineMode")}
              </button>
            </div>
          );
        }
        if (error.type === "offlineNotAllow") {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => window.location.reload()}>
                {t("common.retry")}
              </button>
            </div>
          );
        }
        return "";
      })}
    </div>
  );
};

export default Errors;
