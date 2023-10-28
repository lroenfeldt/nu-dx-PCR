import { useState, useEffect } from "react";
import { useData } from "../hooks";
import { Oval } from "react-loader-spinner";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useResults, useTranslation } from "../hooks";
import { Block, Button, Text } from "../components";

const TestDone = () => {
  const {
    reset,
    testid,
    errors,
    setErrors,
    settings,
    offlineMode,
    setOfflineMode,
    testDone,
    resultsSubmitted,
    currentUser,
    setDeviceStatus,
    selectedMethod,
  } = useData();
  const [USBPresent, setUSBPresent] = useState(false);
  const userId = currentUser ? currentUser?.id : "";
  const navigate = useNavigate();
  const {
    checkUSB,
    saveToUSB,
    submitAll,
    getResults,
    submitResult,
    saveAllToUSB,
  } = useResults();
  const { t, locale } = useTranslation();
  const testmethod = settings.account.testprocedures.find(
    (testmethod) => testmethod.id === selectedMethod
  );

  let buttonUSB;
  if (USBPresent) {
    buttonUSB = (
      <Button onClick={() => saveToUSB(testid, testDone)}>
        {t("results.saveToUSB")}
      </Button>
    );
  } else {
    buttonUSB = (
      <Button disabled onClick={() => saveToUSB(testid, testDone)}>
        {t("results.saveToUSB")}
      </Button>
    );
  }

  const hideError = (index: number) => {
    setErrors(errors.filter((error, errIndex) => errIndex !== index));
  };

  const activateofflineMode = (errIndex: number) => {
    setOfflineMode(true);
    hideError(errIndex);
  };

  const displayErrors = () => {
    return (
      <div className="errorContainer">
        {errors.map((error, i) => {
          if (error.type === "submit") {
            return (
              <div key={i} className="errorMessage">
                <p>{error.message}</p>
                <button onClick={() => submitResult(testid, false)}>
                  {t("common.retry")}
                </button>
                <button onClick={() => activateofflineMode(i)}>
                  {t("common.offlineMode")}
                </button>
              </div>
            );
          }
          if (error.type === "invalid") {
            return (
              <div key={i} className="errorMessage">
                <p>{error.message}</p>
                <button onClick={() => hideError(i)}>
                  {t("common.close")}
                </button>
              </div>
            );
          }
          return "";
        })}
      </div>
    );
  };

  //End Linegene and submit if online
  useEffect(() => {
    if (!resultsSubmitted) {
      if (!offlineMode && settings.account.submitResults) {
        //displayResults(testid)
        submitResult(testid, false);
      }
    }
  }, [offlineMode, resultsSubmitted, settings.account.submitResults, testid]);

  //Check if USB is Present
  useEffect(() => {
    setDeviceStatus("IDLE");
    checkUSB();
    const clearcheckUSB = setInterval(() => checkUSB(), 3000);
    return () => clearInterval(clearcheckUSB);
  }, []);

  //Output
  if (offlineMode) {
    return (
      <Block flex column center height={"100%"} alignCenter gap={32}>
        <Block className="spinnerContainer">
          <FaCheckCircle />
        </Block>

        <Block flex center alignCenter>
          {testmethod && testmethod.showResults ? buttonUSB : ""}
          <Block marginLeft={16} marginRight={16}></Block>
          {testmethod && testmethod.showResults ? (
            <Button onClick={() => navigate("/ViewResults")}>
              {t("results.viewResults")}
            </Button>
          ) : (
            ""
          )}
        </Block>
        <Block flex center alignCenter>
          <Button
            onClick={() => {
              reset();
              navigate("/selectMethod");
            }}
          >
            {t("results.newTest")}
          </Button>
        </Block>
      </Block>
    );
  } else if (resultsSubmitted || !settings.account.submitResults) {
    return (
      <Block flex column center height={"100%"} alignCenter gap={32}>
        <Block className="spinnerContainer">
          <FaCheckCircle />
        </Block>

        <Block flex center alignCenter>
          {testmethod && testmethod.showResults ? buttonUSB : ""}
          <Block marginLeft={16} marginRight={16}></Block>
          {testmethod && testmethod.showResults ? (
            <Button onClick={() => navigate("/ViewResults")}>
              {t("results.viewResults")}
            </Button>
          ) : (
            ""
          )}
        </Block>
        <Block flex center alignCenter>
          <Button
            onClick={() => {
              reset();
              navigate("/selectMethod");
            }}
          >
            {t("results.newTest")}
          </Button>
        </Block>
      </Block>
    );
  } else {
    return (
      <Block flex column center height={"90%"} alignCenter gap={32}>
        <Block>
          <Oval height="100" width="100" color="var(--primary)" />
        </Block>
        <Text h2>{t("results.waitingForResults")}</Text>
        <Text p>{t("results.wait")}</Text>
      </Block>
    );
  }
};

export default TestDone;
