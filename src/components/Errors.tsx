import React, { useCallback } from "react";
import { useData, useResults, useTranslation } from "../hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { IError } from "../types/interfaces/interfaces";
import { IHideErrorProps } from "../types/components";
import { Block, Button, Text } from ".";
import { Email, Phone } from "./Icons";

const Errors: React.FC = () => {
  const {
    setOfflineMode,
    reboot,
    errors,
    reset,
    testid,
    setDeviceStatus,
    // startTest,
    setErrors,
  } = useData();
  const { submitResult } = useResults();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const hideError = ({ type, index, remember }: IHideErrorProps) => {
    if (type)
      setErrors((prevErrors: IError[]) =>
        prevErrors.filter((error) => error.type !== type)
      );
    if (remember) setOfflineMode(true);
    if (index || index == 0)
      setErrors((prevErrors: IError[]) =>
        prevErrors.filter((_error, errIndex) => errIndex != index)
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
  // const activateOffline = (errIndex: number) => {
  //   setOfflineMode(true);
  //   hideError({ index: errIndex });
  // };
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
            <Block
              padding={32}
              bgColor="#FFF"
              width={708}
              key={i}
              radius={16}
              flex
              column
              dropShadowLarge
              gap={32}
            >
              <Block>
                <Text style={{ marginBottom: "8px" }} h3>
                  {error.message}
                </Text>
                <Text h4>{error.messageOne}</Text>
              </Block>
              <Block flex row spaceBetween>
                <Button
                  outlined
                  width="300px"
                  onClick={() => {
                    hideError({ index: i });
                  }}
                >
                  {t("common.close")}
                </Button>

                <Button
                  width="300px"
                  onClick={() => {
                    hideError({ index: i });
                    submitResult(testid, false);
                  }}
                >
                  {t("common.retry")}
                </Button>
              </Block>
              <Block bgColor="#CAE4FC" radius={16} padding={16}>
                <Text style={{ fontWeight: 500 }} h5>
                  {error.messageTwo}
                </Text>

                <Block marginTop={16} flex row gap={32}>
                  <Block flex row gap={5}>
                    <Email />
                    <Text style={{ fontWeight: 500 }} h5>
                      support@nu-diagnostics.com
                    </Text>
                  </Block>

                  <Block flex row gap={5}>
                    <Phone />
                    <Text style={{ fontWeight: 500 }} h5>
                      +494123/123456789
                    </Text>
                  </Block>
                </Block>
              </Block>
            </Block>
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
              {/* <button onClick={() => startTest()}>{t("common.retry")}</button> */}
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
