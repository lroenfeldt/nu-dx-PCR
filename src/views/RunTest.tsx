import React, { useState, useEffect } from "react";
import { ProgressBar } from "../components";
import { useData, useTranslation } from "../hooks";
import { useNavigate } from "react-router-dom";
import functions from "../utils/functions";
import { Oval } from "react-loader-spinner";
import { errorProps } from "../constants/errorProps";

const RunTest = () => {
  const navigate = useNavigate();
  const {
    demo,
    testid,
    errors,
    settings,
    setErrors,
    toggleLid,
    isNinetySix,
    selectedMethod,
  } = useData();
  const procedure = settings.account.testprocedures.find(
    (procedure) => procedure.id === selectedMethod
  );
  const testDuration = procedure ? procedure.durationMinutes * 60 : 0;

  const { t } = useTranslation();
  const startTime = demo ? 360 : testDuration;
  const [remTime, setRemTime] = useState(startTime);
  const [startedAt, setStartedAt] = useState(Math.floor(Date.now() / 1000));
  const finishedAt = startedAt + startTime;
  const [waitingForResults, setWaitingForResults] = useState(false);
  const [resultPresent, setResultPresent] = useState(false);
  const [flapClosed, setFlapClosed] = useState(true);
  const showCancel = () => {
    let newErrors = errors.filter((error) => error.type !== "cancelTest");
    newErrors.push({
      code: errorProps.cancelTest.code,
      id: errorProps.cancelTest.id,
      type: "cancelTest",
      message: t("runTest.cancelTest"),
    });
    setErrors(newErrors);
  };
  useEffect(() => {
    if (isNinetySix) {
      setFlapClosed(false);
      setTimeout(() => {
        setFlapClosed(true);
      }, 1000 * 60 * 2);
    }
  }, []);

  //Animate Progress
  useEffect(() => {
    const countdown = setInterval(() => {
      if (finishedAt >= Math.floor(Date.now() / 1000)) {
        setRemTime(finishedAt - Math.floor(Date.now() / 1000));
      }
    }, 1000);
    if (remTime <= 2) {
      setWaitingForResults(true);
    }

    return () => clearInterval(countdown);
  }, [remTime]);

  //Check for result file
  useEffect(() => {
    const checkFile = setInterval(() => {
      let resultPresent = window.api.checkResultFile(testid);
      setResultPresent(resultPresent);
      if (resultPresent) {
        clearInterval(checkFile);
        setWaitingForResults(true);
        window.api.logEvents(
          `Result for test ${testid} found, waiting for writing process to finish...`
        );
        setTimeout(async () => {
          window.api.endLineGene();

          setTimeout(() => {
            toggleLid();
            if (!window.api.moveResultFile(testid)) {
              window.api.logEvents(
                `Result for test ${testid} could not be moved`
              );
              setErrors(
                errors
                  .filter((err) => err.type != "moveResults")
                  .concat({
                    code: errorProps.moveResults.code,
                    id: errorProps.moveResults.id,
                    type: "moveResults",
                    message: t("errors.failedToMoveResults"),
                  })
              );
            } else {
              setTimeout(() => {
                navigate("/uploadResults");
              }, 2000);
            }
          }, 3000);
        }, 3000);
      } else {
        window.api.logEvents(`Result for test ${testid} not present (yet)`);

        if (finishedAt + 60 * 20 < Math.floor(Date.now() / 1000)) {
          setWaitingForResults(false);
          setErrors(
            errors
              .filter((err) => err.type != "testFailed")
              .concat({
                code: errorProps.testFailed.code,
                id: errorProps.testFailed.id,
                type: "testFailed",
                message: t("errors.testFailed"),
              })
          );
          clearInterval(checkFile);
        }
      }
    }, 5000);
    return () => clearInterval(checkFile);
  }, []);

  const displayTime = functions.secondsToHms(remTime);

  return (
    <div className="RunTest">
      {!waitingForResults ? (
        <>
          <h2>
            {flapClosed
              ? t("runTest.testRunning")
              : t("runTest.testRunningFlapClose")}
          </h2>
          <div className="progressVisualization">
            <ProgressBar startTime={startTime} remTime={remTime} />
          </div>
          <h2 className="timeLeft">
            {remTime == 0
              ? t("runTest.endOfTest")
              : t("common.still") + " " + displayTime}
          </h2>
        </>
      ) : (
        <div>
          <div className="spinnerContainer">
            <Oval height="100" width="100" color="var(--primary)" />
          </div>
          <h2>{t("runTest.waitingForResult")}...</h2>
        </div>
      )}
      <div className="buttonArea discouraged">
        {<button onClick={() => showCancel()}>{t("common.cancel")}</button>}
      </div>
    </div>
  );
};

export default RunTest;
