import { useEffect } from "react";
import { Toggle } from "../components";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { BsCloudCheckFill } from "react-icons/bs";
import { PiWarningCircleFill } from "react-icons/pi";
import { useData, useTranslation } from "../hooks";
import { AiFillUsb } from "react-icons/ai";
import { FaMicroscope, FaCloudUploadAlt, FaCheck } from "react-icons/fa";
import { useResults, useSticky } from "../hooks";
import urls from "../config/settings";
import { errorProps } from "../constants/errorProps";
import { error } from "console";

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
    setErrors((prevErrors) =>
      prevErrors
        .filter((error) => error.type !== "submit")
        .concat({
          code: errorProps.submit.code,
          id: errorProps.submit.id,
          type: "submit",
          message: t("errors.failedToSaveControlSample"),
        })
    );
  };

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
      let submittingFailed;

      //button for db submit
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
      } else if (
        !result.isSubmitting &&
        !failedSubmittingResults.includes(result.testid)
      ) {
        buttonSubmit = (
          <div
            className="button"
            onClick={() => {
              submitResult(result.testid, result.submitted);
              setTestid(result.testid);
            }}
          >
            <FaCheck />
          </div>
        );
      } else if (failedSubmittingResults.includes(result.testid)) {
        buttonSubmit = (
          <div onClick={() => openError()} className="button error">
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
            <FaCloudUploadAlt />
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
      // if (failedSubmittingResults.includes(result.testid)) {
      //   submittingFailed = (
      //     <div onClick={() => openError()} className="button error">
      //       <PiWarningCircleFill size={30} />
      //     </div>
      //   );
      // }

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
            {/* {submittingFailed} */}
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
    const clearcheckUSB = setInterval(() => checkUSB(), 3000);
    return () => clearInterval(clearcheckUSB);
  }, []);
  useSticky({ top: 70, id: "stickyHeader", stickyClass: "ResultList" });
  return (
    <div className="ResultList">
      <div id="stickyHeader" className="titleArea">
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
