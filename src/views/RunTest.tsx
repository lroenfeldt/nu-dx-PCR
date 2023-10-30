import { useState, useEffect } from "react";
import { Block, Button, ProgressBar, Text } from "../components";
import { useData, useTheme, useTranslation } from "../hooks";
import { useNavigate } from "react-router-dom";
import functions from "../utils/functions";
import OvalSpinner from "../components/OvalSpinner";

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
  const { colors } = useTheme();
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
        console.log(
          "result for test " +
            testid +
            " found, waiting for writing process to finish..."
        );
        window.api.logEvents(
          `Result for test ${testid} found, waiting for writing process to finish...`
        );
        setTimeout(async () => {
          console.log("ending linegene...");
          window.api.endLineGene();

          setTimeout(() => {
            toggleLid();
            if (!window.api.moveResultFile(testid)) {
              console.log("result for test " + testid + " could not be moved");
              window.api.logEvents(
                `Result for test ${testid} could not be moved`
              );
              setErrors(
                errors
                  .filter((err) => err.type != "moveResults")
                  .concat({
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
        console.log("result for test " + testid + " not present (yet)");
        window.api.logEvents(`Result for test ${testid} not present (yet)`);

        if (finishedAt + 60 * 20 < Math.floor(Date.now() / 1000)) {
          setWaitingForResults(false);
          setErrors(
            errors
              .filter((err) => err.type != "testFailed")
              .concat({
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
    <Block flex column center height={"100%"} alignCenter gap={32}>
      {!waitingForResults ? (
        <>
          <Text h2>
            {flapClosed
              ? t("runTest.testRunning")
              : t("runTest.testRunningFlapClose")}
          </Text>
          <Block width="728px" height="16px">
            <ProgressBar remTime={remTime} startTime={startTime} />
          </Block>
          <Text h2>
            {remTime == 0
              ? t("runTest.endOfTest")
              : t("common.still") + " " + displayTime}
          </Text>
          <Block>
            <Button outlined onClick={() => showCancel()}>
              {t("runTest.cancel")}
            </Button>
          </Block>
        </>
      ) : (
        <Block flex column center height={"80%"} alignCenter gap={32}>
          <OvalSpinner height="100px" width="100px" />
          <Text h2>{t("runTest.waitingForResult")}</Text>
        </Block>
      )}
    </Block>
  );
};

export default RunTest;
