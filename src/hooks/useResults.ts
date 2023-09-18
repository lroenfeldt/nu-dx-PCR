import { useData, useTranslation } from "../hooks";
import {
  extractBarcodes,
  parseResultsDB,
  parseResultsExport,
} from "../utils/parseResults";
import axios from "axios";
import urls from "../config/settings";
import { useLocation } from "react-router-dom";
import {
  TgetResults,
  TsaveToUSB,
  TsubmitAll,
  TsubmitAutoControls,
  TsubmitResult,
} from "../types/interfaces/useResults";
import {
  IAutoControl,
  IExtractedBarcodes,
} from "../types/interfaces/parseResults";
import { IConfigFile, ITestProcedure } from "../types/interfaces/settings";

/**
 * hook to handle all the results related functions
 * @param {object} props
 * @returns {object} results
 *
 */
const useResults = () => {
  const {
    setErrors,
    settings,
    setTestDone,
    submitFilter,
    currentUser,
    setUSBPresent,
    results,
    setResults,
    setReading,
    setSubmitting,
    setSubmitted,
    lotNumber,
    setFailedSubmittingResults,
  } = useData();

  const location = useLocation();
  const { t } = useTranslation();
  const userId = currentUser ? currentUser?.id : "";

  /**
   * submit Auto Controls  to db
   * @param {Array} barcodes - barcodes of the auto controls
   * @param {string} testid - testid of the test
   * @param {string} orderKey - orderKey of the test
   * @param {string} hardwareId - hardwareId of the device
   * @param {string} submitControlUrl - url to submit the auto controls
   * @param {string} fetchControlUrl - url to fetch the auto controls
   * @returns {object} - The parsed results
   */
  const submitAutoControls: TsubmitAutoControls = async (
    barcodes,
    testid,
    orderKey,
    hardwareId,
    submitControlUrl,
    fetchControlUrl
  ) => {
    window.api.logEvents(
      `Arguemnts: ${testid} ${orderKey} ${submitControlUrl} ${fetchControlUrl}`,
      "logInfos"
    );
    //validate input
    if (!Array.isArray(barcodes)) {
      throw Error("Invalid barcodes provdided: " + barcodes);
    }
    if (!(testid && orderKey && submitControlUrl && fetchControlUrl)) {
      throw Error("insufficient arguments");
    }
    //process barcodes
    let autoControls: IAutoControl[] = [];
    let placeholders = [
      "Placeholder_NTC",
      "Placeholder_TPC",
      "NTC",
      "TPC",
      "SC2NTC",
      "SC2TPC",
    ];
    barcodes.forEach((barcode) => {
      if (
        placeholders.includes(barcode.value) ||
        barcode.value.indexOf("-R") !== -1
      ) {
        let dbLabel = barcode.value;
        const ntcPlaceholders = ["Placeholder_NTC", "NTC", "SC2NTC"];
        const tpcPlaceholders = ["Placeholder_TPC", "TPC", "SC2TPC"];

        if (ntcPlaceholders.includes(barcode.value)) {
          dbLabel = "NTC";
        }
        if (tpcPlaceholders.includes(barcode.value)) {
          dbLabel = "TPC";
        }

        autoControls.push({
          type: dbLabel,
          position: barcode.position,
          run: testid,
          order: orderKey,
          device: hardwareId,
        });
      }
    });
    //check if autocontrols present
    if (autoControls.length === 0) {
      console.log("No Auto Control Placeholders found");
      return autoControls;
    }

    //submit to db
    try {
      const response = await axios.post(submitControlUrl, autoControls);

      window.api.logEvents(
        `submitAutoControls response: ${JSON.stringify(response)}`,
        "logInfos"
      );
      const createdSamples = response.data.imported_data[0].save_response;

      window.api.logEvents(
        `submitAutoControls createdSamples: ${JSON.stringify(createdSamples)}`,
        "logInfos"
      );
      for (let i = 0; i < autoControls.length; i++) {
        try {
          const generatedBarcode = await axios.get(
            `${fetchControlUrl}${createdSamples[i].sample_id}`
          );
          autoControls[i].barcode = generatedBarcode.data.sample;
        } catch (err) {
          console.error(err);
          window.api.logEvents(`submitAutoControls error: ${err}`, "logErrors");
          throw err;
        }
      }
    } catch (err) {
      console.error(err);
      window.api.logEvents(`submitAutoControls error: ${err}`, "logErrors");
      throw err;
    }

    return autoControls;
  };

  const setSubmittingSingle = (testid: string, isSubmitting: boolean) => {
    setResults((prevUnsubmittedResults) =>
      prevUnsubmittedResults.map((result) => {
        if (result.testid === testid) {
          let newResult = result;
          newResult.isSubmitting = isSubmitting;
          return newResult;
        } else {
          return result;
        }
      })
    );
  };
  const setWritingSuccess = (testid: string, isSuccess: boolean) => {
    setResults((prevUnsubmittedResults) =>
      prevUnsubmittedResults.map((result) => {
        if (result.testid === testid) {
          let newResult = result;
          newResult.writingSuccess = isSuccess;
          return newResult;
        } else {
          return result;
        }
      })
    );
  };

  const submitAll: TsubmitAll = () => {
    setSubmitting(true);
    const resultList = results.filter(
      (result) => result && result.submitted === false
    );
    let promises = resultList.map((result) =>
      submitResult(result.testid, result.submitted)
    );
    Promise.all(promises).then(() => {
      setSubmitting(false);
    });
  };

  const saveAllToUSB = () => {
    results.forEach((result) => {
      saveToUSB(result.testid, result.submitted);
    });
  };

  const checkUSB = async () => {
    try {
      setUSBPresent(await window.api.checkUSB());
    } catch (error) {
      console.error(error);
      window.api.logEvents(`checkUSB: ${error}`, "logErrors");
    }
  };

  const setWriting = (testid: string, isWriting: boolean) => {
    setResults((prevUnsubmittedResults) =>
      prevUnsubmittedResults.map((result) => {
        if (result.testid === testid) {
          let newResult = result;
          newResult.isWriting = isWriting;
          return newResult;
        } else {
          return result;
        }
      })
    );
  };

  /**
   * Save a single result to the USB
   * @param {string} testid
   * @param {Boolean} done
   * @returns {Boolean} true if writing to USB was successful
   */
  const saveToUSB: TsaveToUSB = async (testid, done) => {
    if (location.pathname == "/ResultList") setWriting(testid, true);

    //reset errors
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.type !== "read")
    );

    //init data
    let resultFile: string;
    let testConfig: IConfigFile;
    let testmethod: ITestProcedure;

    //read result file
    try {
      window.api.logEvents(`fetching result files`, "logErrors");

      let fetchResult = await window.api.getResult(testid, done);
      const configFile = fetchResult.configFile;
      resultFile = fetchResult.resultFile;
      testConfig = JSON.parse(configFile);
      if (!testConfig.testmethod) {
        testConfig.testmethod = urls.TESTMETHOD;
      }
      testmethod = settings.account.testprocedures.find(
        (method) => method.id === testConfig.testmethod
      ) as ITestProcedure;
    } catch (err) {
      console.error(err);
      window.api.logEvents(`saveToUSB: ${err}`, "logErrors");
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== "read")
          .concat({
            type: "read",
            message: t("errors.failedToReadTestData"),
          })
      );
      if (location.pathname == "/ResultList") setWriting(testid, false);
      return false;
    }

    //Parse Results
    window.api.logEvents(`parse results`, "logInfos");
    let parsedResults;
    try {
      parsedResults = parseResultsExport(
        resultFile,
        testid,
        testConfig,
        testmethod,
        lotNumber
      );
    } catch (err) {
      console.error(err);
      window.api.logEvents(`saveToUSB: ${err}`, "logErrors");
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== "submit")
          .concat({
            type: "submit",
            message: t("errors.failedToReadResultData"),
          })
      );
      if (location.pathname == "/ResultList") setWriting(testid, false);
      return false;
    }

    //Save To USB
    try {
      await window.api.saveToUSB(testid, parsedResults);
      if (location.pathname == "/ResultList") setWriting(testid, false);
      setWritingSuccess(testid, true);
    } catch (error) {
      console.error(error);
      window.api.logEvents(`saveToUSB: ${error}`, "logErrors");
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== "saveToUSB")
          .concat({
            type: "read",
            message: t("errors.failedToSaveResultData"),
          })
      );
      if (location.pathname == "/ResultList") setWriting(testid, false);
      return false;
    }
    return true;
  };

  const setSubmittingSuccess = (testid: string, isSuccess: boolean) => {
    setResults((prevUnsubmittedResults) =>
      prevUnsubmittedResults.map((result) => {
        if (result.testid === testid) {
          let newResult = result;
          newResult.submittingSuccess = isSuccess;
          return newResult;
        } else {
          return result;
        }
      })
    );
  };

  const getResults: TgetResults = async (filter) => {
    setReading(true);
    try {
      let newResults = await window.api.getTests();
      if (!newResults) {
        newResults = [];
      }
      if (filter) {
        newResults = newResults.filter((result) => !result.submitted);
      }
      setResults(newResults);
    } catch (err) {
      console.error(err);
      window.api.logEvents(`getResults: ${err}`, "logErrors");
    }
    setReading(false);
  };

  /**
   * Submit a single result to the server
   * @param {string} testid
   * @param {Boolean} done
   * @returns void
   */
  const submitResult: TsubmitResult = async (testid, done) => {
    window.api.logEvents(`attempting submit`, "logInfos");
    setSubmitting(true);
    setSubmittingSingle(testid, true);
    //reset errors
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.type !== "submit")
    );
    //init data & fetch file
    let testConfig: IConfigFile;
    let barcodes: IExtractedBarcodes[] = [];
    let resultFile: string;
    let orderKey: string;
    let hardwareId: string;
    let testStarted: string | Date;
    let testmethod: ITestProcedure;
    let override: string | undefined;

    let autoControls: IAutoControl[] | undefined = [];

    try {
      window.api.logEvents(`fetching result files`, "logInfos");

      let fetchResult = await window.api.getResult(testid, done);
      const configFile = fetchResult.configFile;
      resultFile = fetchResult.resultFile;
      testConfig = JSON.parse(configFile);
      testStarted = fetchResult.testStarted;
      barcodes = extractBarcodes(resultFile);
      override = fetchResult.override;
      if (!testConfig.testmethod) {
        testConfig.testmethod = urls.TESTMETHOD;
      }
      testmethod = settings.account.testprocedures.find(
        (method) => method.id === testConfig.testmethod
      ) as ITestProcedure;
      orderKey = testConfig.account.orderKey;
      hardwareId = testConfig.device.hardwareId;
    } catch (err) {
      console.error("failedToReadTestData: " + JSON.stringify(err));
      window.api.logEvents(`submitResult: ${err}`, "logErrors");
      setFailedSubmittingResults((prevFailedSubmittingResults) =>
        prevFailedSubmittingResults.filter((id) => id !== testid).concat(testid)
      );

      if (!settings?.account?.autoSubmitResults) {
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== "read")
            .concat({
              type: "read",
              message: t("errors.failedToReadTestData"),
            })
        );
      }
      setSubmitting(false);
      setSubmittingSingle(testid, false);
      return false;
    }

    //define urls
    const submitControlUrl = testConfig.account.customSubmitAutoControlEndpoint
      ? testConfig.account.customSubmitAutoControlEndpoint
      : urls.submitControlUrl;
    const fetchControlUrl = testConfig.account.customFetchAutoControlEndpoint
      ? testConfig.account.customFetchAutoControlEndpoint
      : urls.fetchControlUrl;
    const resultUrl = testConfig.account.customSubmitResultsEndpoint
      ? testConfig.account.customSubmitResultsEndpoint
      : urls.resultUrl;
    //Submit ControlSamples
    window.api.logEvents(`check for auto controls`, "logInfos");
    if (settings.account.preregisterControlSamples) {
      try {
        autoControls = await submitAutoControls(
          barcodes,
          testid,
          orderKey,
          hardwareId,
          submitControlUrl,
          fetchControlUrl
        );
      } catch (err) {
        console.error(`submitAutoControls failed: ${err}`);
        window.api.logEvents(`submitResult: ${err}`, "logErrors");

        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== "submit")
            .concat({
              type: "submit",
              message: t("errors.failedToSaveControlSample"),
            })
        );
        setSubmitting(false);
        setSubmittingSingle(testid, false);
        return false;
      }
    }

    //Parse Results;
    window.api.logEvents(`parse results`, "logInfos");
    let parsedResults;
    try {
      parsedResults = parseResultsDB(
        testid,
        resultFile,
        testmethod,
        testConfig,
        autoControls,
        testStarted,
        userId,
        override,
        lotNumber === null ? undefined : lotNumber
      );
    } catch (err) {
      console.error(`parseResultsDB failed: ${err}`);
      window.api.logEvents(`parseResultsDB failed: ${err}`, "logErrors");
      setFailedSubmittingResults((prevFailedSubmittingResults) =>
        prevFailedSubmittingResults.filter((id) => id !== testid).concat(testid)
      );
      if (!settings?.account?.autoSubmitResults) {
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== "submit")
            .concat({
              type: "submit",
              message: t("errors.failedToReadResultData"),
            })
        );
      }
      setSubmitting(false);
      setSubmittingSingle(testid, false);
      return false;
    }

    //Submit Results
    window.api.logEvents(`submit to db`, "logInfos");
    try {
      let submitResponse = await axios.post(resultUrl, parsedResults);

      window.api.logEvents(
        `submit to db: ${JSON.stringify(submitResponse)}`,
        "logInfos"
      );
      const msg = submitResponse.data.msg;
      const missing = msg.search("Fehlende Proben");
      if (missing !== -1) {
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== "submit")
            .concat({
              type: "submit",
              message: t("errors.failedToSendSomeResults", {
                missing: msg.substr(missing),
              }),
            })
        );
      }
    } catch (err) {
      console.error(`submitResponse: ${err}`);
      window.api.logEvents(`submitResponse: ${err}`, "logErrors");
      setFailedSubmittingResults((prevFailedSubmittingResults) =>
        prevFailedSubmittingResults.filter((id) => id !== testid).concat(testid)
      );

      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== "submit")
          .concat({
            type: "submit",
            message: t("errors.failedToSubmitResults"),
          })
      );

      setSubmitting(false);
      setSubmittingSingle(testid, false);
      return false;
    }

    //Move Result Files if successfull
    window.api.logEvents(`move result file to done directory`, "logInfos");
    try {
      window.api.moveFiles(testid);
      setSubmittingSingle(testid, false);
      setSubmittingSuccess(testid, true);
      setSubmitted(true);
      setTestDone(true);
    } catch (err) {
      console.error(`move result file to done directory: ${err}`);
      window.api.logEvents(
        `move result file to done directory: ${err}`,
        "logErrors"
      );
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== "submit")
          .concat({
            type: "submit",
            message: t("errors.failedToMoveSubmittedFiles"),
          })
      );
      setSubmitting(false);
      setSubmittingSingle(testid, false);
      return false;
    }
    getResults(submitFilter);
    setSubmitting(false);
    return true;
  };

  return {
    checkUSB,
    saveToUSB,
    submitAll,
    getResults,
    submitResult,
    saveAllToUSB,
    submitAutoControls,
  };
};

export default useResults;
