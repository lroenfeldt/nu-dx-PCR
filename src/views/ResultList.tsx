import { useEffect } from "react";
import { Text, Toggle } from "../components";
import { useNavigate } from "react-router-dom";
import { BsCloudCheckFill } from "react-icons/bs";
import { PiWarningCircleFill } from "react-icons/pi";
import { useData, useTranslation } from "../hooks";
import { AiFillUsb } from "react-icons/ai";
import { FaMicroscope, FaCloudUploadAlt, FaCheck } from "react-icons/fa";
import { useResults, useSticky } from "../hooks";
import urls from "../config/settings";
import OvalSpinner from "../components/OvalSpinner";

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

  const viewResult = (testid, done) => {
    resetBarcodes();
    setTestid(testid);
    setTestDone(done);
    navigate("/ViewResults");
  };

  //Create Table

  let tableRows = [];
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
            onClick={() => submitResult(result.testid, result.submitted)}
          >
            <OvalSpinner size="30px" />
          </div>
        );
      } else if (!result.isSubmitting) {
        buttonSubmit = (
          <div
            className="button"
            onClick={() => submitResult(result.testid, result.submitted)}
          >
            <FaCheck />
          </div>
        );
      } else if (offlineMode) {
        buttonSubmit = (
          <div className="button disabled">
            <FaCloudUploadAlt />
          </div>
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
              <OvalSpinner size="30px" />
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
        } else if (
          !settings.account.testprocedures.find(
            (testmethod) => testmethod.id === result.testmethod
          ) ||
          settings.account.testprocedures.find(
            (testmethod) => testmethod.id === result.testmethod
          ).showResults == false
        ) {
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
        if (
          !settings.account.testprocedures.find(
            (testmethod) => testmethod.id === result.testmethod
          ) ||
          settings.account.testprocedures.find(
            (testmethod) => testmethod.id === result.testmethod
          ).showResults == false
        ) {
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
      let submittingFailed;
      if (failedSubmittingResults.includes(result.testid)) {
        submittingFailed = (
          <div className="button error">
            <PiWarningCircleFill size={30} />
          </div>
        );
      }

      //Testmethod name
      let testMethodName;
      if (!result.testmethod) {
        result.testmethod = urls.TESTMETHOD; //Covid backwards compatability
      }
      if (
        settings.account.testprocedures.find(
          (testmethod) => testmethod.id === result.testmethod
        )
      ) {
        testMethodName =
          settings.account.testprocedures.find(
            (testmethod) => testmethod.id === result.testmethod
          )["label" + locale.toUpperCase()] ||
          settings.account.testprocedures.find(
            (testmethod) => testmethod.id === result.testmethod
          ).name;
      } else {
        testMethodName = "unsupported";
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
            {submittingFailed}
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
        <Text h2>{t("resultList.title")}</Text>
        {(submitting || reading) && <OvalSpinner height="50px" width="50px" />}
        <label>
          <Text h4>{t("resultList.onlyPending")}</Text>
          <Toggle
            isOn={submitFilter}
            handleToggle={() => handleSubmitToggleChange()}
          />
        </label>
      </div>
      {tableRows}
    </div>
  );
};

export default ResultList;
