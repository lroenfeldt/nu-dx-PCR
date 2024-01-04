import { useEffect, useState } from "react";
import { Errors, Toggle } from "../components";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { BsCloudCheckFill } from "react-icons/bs";
import { PiWarningCircleFill } from "react-icons/pi";
import { useData, useTranslation } from "../hooks";
import { AiFillUsb } from "react-icons/ai";
import { FaMicroscope, FaCloudUploadAlt, FaCheck } from "react-icons/fa";
import { useResults, useSticky } from "../hooks";
import urls from "../config/settings";

const ResultList = () => {
  const navigate = useNavigate();
  const {
    USBPresent,
    settings,
    setTestid,
    resetBarcodes,
    offlineMode,
    setTestDone,
    submitFilter,
    setSubmitFilter,
    results,
    reading,
    submitting,
    failedSubmittingResults,
    setErrors,
    resultSubmitted,
    setResultSubmitted,
    errorsCopy,
    testid,
  } = useData();
  const {
    checkUSB,
    saveToUSB,
    submitAll,
    getResults,
    submitResult,
    saveAllToUSB,
  } = useResults();
  const { t, locale } = useTranslation();
  const [buttonIsVisible, setButtonIsVisible] = useState<boolean>(false);

  // let testidCopy: string[] = [];
  const handleSubmitToggleChange = () => {
    getResults(!submitFilter);
    setSubmitFilter(!submitFilter);
  };

  const viewResult = (testid: string, done: boolean) => {
    resetBarcodes();
    setTestid(testid);
    setTestDone(done);
    navigate("/ViewResults");
  };

  const openError = () => {
    setErrors(
      errorsCopy
        .filter((error) => {
          return error.testid === testid;
        })
        .filter((error, index, array) => {
          return (
            array.findIndex((item) => item.testid === error.testid) === index
          );
        })
    );
  };

  useEffect(() => {
    console.log(testid);
    console.log(
      errorsCopy
        .filter((error) => {
          return error.testid === testid;
        })
        .filter((error, index, array) => {
          return (
            array.findIndex((item) => item.testid === error.testid) === index
          );
        })
    );
  }, [testid, errorsCopy]);

  useEffect(() => {
    if (resultSubmitted) {
      setButtonIsVisible(true);
      const timeoutId = setTimeout(() => {
        setButtonIsVisible(false);
      }, 2000);
      // Clear the timeout if the component is unmounted
      return () => clearTimeout(timeoutId);
    }
  }, [resultSubmitted, buttonIsVisible]);

  //Create Table
  let tableRows: any[] = [];
  results
    .sort(
      (a, b) =>
        new Date(b.testStarted).getTime() - new Date(a.testStarted).getTime()
    )
    .forEach((result, index) => {
      let buttonUSB;
      let buttonSubmit;
      let buttonView;

      //button for db submit
      if (result.isSubmitting) {
        buttonSubmit = (
          <div
            className="button"
            onClick={() => {
              setResultSubmitted(result.submitted);
              submitResult(result.testid, result.submitted);
            }}
          >
            <div className="spinnerContainer">
              <Oval height="30" width="30" color="white" />
            </div>
          </div>
        );
      } else if (
        !result.isSubmitting &&
        !failedSubmittingResults.includes(result.testid)
      ) {
        buttonSubmit = (
          <div
            className="button"
            onClick={() => {
              setTestid(result.testid);
              setResultSubmitted(result.submitted);
              submitResult(result.testid, result.submitted);
            }}
          >
            <FaCloudUploadAlt />
          </div>
        );
      } else if (failedSubmittingResults.includes(result.testid)) {
        buttonSubmit = (
          <div
            onClick={() => {
              setTestid(result.testid);
              openError();
            }}
            className="button error"
          >
            <PiWarningCircleFill size={30} />
          </div>
        );
      } else if (offlineMode) {
        buttonSubmit = (
          <div className="button disabled">{/* <FaCloudUploadAlt /> */}</div>
        );
      } else if (
        !settings.account.testprocedures.find(
          (testmethod) => testmethod.id === result.testmethod
        )
      ) {
        buttonSubmit = (
          <div className="button disabled">
            <FaCloudUploadAlt />
          </div>
        );
      } else {
        buttonSubmit = (
          <div
            className="button"
            onClick={() => submitResult(result.testid, result.submitted)}
          >
            <FaCheck />
          </div>
        );
      }

      if (result.submitted) {
        buttonSubmit = buttonIsVisible ? (
          <div className="button">
            <FaCheck />
          </div>
        ) : null;
      }
      if (failedSubmittingResults.includes(result.testid)) {
        buttonSubmit = (
          <div
            onClick={() => {
              setTestid(result.testid);
              console.log(result.testid);
              openError();
            }}
            className="button error"
          >
            <PiWarningCircleFill size={30} />
          </div>
        );
      }

      if (result.isSubmitting) {
        buttonSubmit = (
          <div
            className="button"
            onClick={() => submitResult(result.testid, result.submitted)}
          >
            <div className="spinnerContainer">
              <Oval height="30" width="30" color="white" />
            </div>
          </div>
        );
      }

      let cloudBadge;
      if (result.submitted) {
        cloudBadge = (
          <div className="cloudBadge">
            <BsCloudCheckFill />
          </div>
        );
      }
      if (
        failedSubmittingResults.includes(result.testid) ||
        result.isSubmitting == false
      ) {
        cloudBadge = (
          <div className="cloudBadge error">
            <PiWarningCircleFill />
          </div>
        );
      }
      const foundTestMethod = settings.account.testprocedures.find(
        (testmethod) => testmethod.id === result.testmethod
      );
      if (
        settings.account.testprocedures.find(
          (testmethod) => testmethod.id === result.testmethod
        )?.showResults
      ) {
        //button for usb export
        if (result.isWriting) {
          buttonUSB = (
            <div
              className="button"
              onClick={() => saveToUSB(result.testid, result.submitted)}
            >
              <div className="spinnerContainer">
                <Oval height="30" width="30" color="white" />
              </div>
            </div>
          );
        } else if (result.writingSuccess) {
          buttonUSB = (
            <div
              className="button"
              onClick={() => saveToUSB(result.testid, result.submitted)}
            >
              <FaCheck />
            </div>
          );
        } else if (!USBPresent) {
          buttonUSB = (
            <div className="button disabled">
              <AiFillUsb />
            </div>
          );
        } else if (!foundTestMethod || foundTestMethod.showResults === false) {
          buttonUSB = (
            <div className="button disabled">
              <AiFillUsb />
            </div>
          );
        } else {
          buttonUSB = (
            <div
              className="button"
              onClick={() => saveToUSB(result.testid, result.submitted)}
            >
              <AiFillUsb />
            </div>
          );
        }

        //button for view
        if (!foundTestMethod || foundTestMethod.showResults === false) {
          buttonView = (
            <div className="button disabled">
              <FaMicroscope />
            </div>
          );
        } else {
          buttonView = (
            <div
              className="button"
              onClick={() => viewResult(result.testid, result.submitted)}
            >
              <FaMicroscope />
            </div>
          );
        }
      }

      //Testmethod name
      let testMethodName = "unsupported";
      if (!result.testmethod) {
        result.testmethod = urls.TESTMETHOD; //Covid backwards compatability
      }
      if (foundTestMethod) {
        if (
          typeof foundTestMethod[
            `label${locale.toUpperCase()}` as keyof typeof foundTestMethod
          ] === "string"
        ) {
          testMethodName = foundTestMethod[
            `label${locale.toUpperCase()}` as keyof typeof foundTestMethod
          ] as string;
        } else if (foundTestMethod.name) {
          testMethodName = foundTestMethod.name;
        }
      }

      tableRows.push(
        <div className="result" key={`${result.testid}-${index}`}>
          <div className="testinfo">
            <h4>{result.testid}</h4>
            <h4>{testMethodName}</h4>
            <span className="date">
              {t("common.started")}: {result.testStarted.toLocaleString()}
            </span>
            <span className="date">
              {t("common.ended")}: {result.testFinished.toLocaleString()}
            </span>
          </div>
          <div className="buttons">
            {buttonView}
            {buttonSubmit}
            {buttonUSB}
            {cloudBadge}
          </div>
        </div>
      );
    });

  useEffect(() => {
    resetBarcodes();
    getResults(submitFilter);
  }, []);

  //Check if USB is Present
  useEffect(() => {
    checkUSB();
    const clearcheckUSB = setInterval(() => {
      checkUSB();
    }, 3000);

    return () => clearInterval(clearcheckUSB);
  }, []);
  useSticky({ top: 70, id: "stickyHeader", stickyClass: "ResultList" });
  return (
    <div className="ResultList">
      <div
        // id="stickyHeader"
        className="titleArea"
      >
        <h2>{t("resultList.title")}</h2>
        {(submitting || reading) && (
          <div className="spinnerContainer">
            <Oval height="50" width="50" color="var(--primary)" />
          </div>
        )}
        <label>
          <span>{t("resultList.onlyPending")}</span>
          <Toggle
            isOn={submitFilter}
            handleToggle={() => handleSubmitToggleChange()}
          />
        </label>
      </div>
      {tableRows}
      <div className="buttonArea">
        <button
          onClick={() => {
            navigate("/selectMethod");
          }}
        >
          {t("common.back")}
        </button>
        {submitFilter ? (
          <button onClick={() => submitAll()}>
            {t("resultList.submitAll")}
          </button>
        ) : (
          ""
        )}
        <button
          className={!USBPresent ? "disabled" : ""}
          onClick={() => saveAllToUSB()}
        >
          {t("resultList.exportAll")}
        </button>
      </div>
    </div>
  );
};

export default ResultList;
