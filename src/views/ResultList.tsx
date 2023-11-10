import { useEffect } from "react";
import { Block, Button, Errors, Text, Toggle } from "../components";
import { useNavigate } from "react-router-dom";
import { BsCloudCheckFill } from "react-icons/bs";
import { PiWarningCircleFill } from "react-icons/pi";
import { useData, useTheme, useTranslation } from "../hooks";
import { AiFillUsb } from "react-icons/ai";
import { FaMicroscope, FaCloudUploadAlt, FaCheck } from "react-icons/fa";
import { useResults } from "../hooks";
import urls from "../config/settings";
import OvalSpinner from "../components/OvalSpinner";
import AlertRounded from "../components/Icons/AlertRounded";
import ViewResultMsg from "../components/ViewResultMsg";
import CloudSmall from "../components/Icons/CloudSmall";

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
    testid,
  } = useData();
  const { checkUSB, saveToUSB, getResults, submitResult } = useResults();
  const { t, locale } = useTranslation();
  const { colors } = useTheme();

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

  //Create Table
  let tableRows: JSX.Element[] = [];
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
          )?.showResults == false
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
          )?.showResults == false
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
        const testLable: string = "label" + locale.toUpperCase();
        testMethodName =
          settings.account.testprocedures.find(
            (testmethod) => testmethod.id === result.testmethod
          )?.[testLable] ||
          settings.account.testprocedures.find(
            (testmethod) => testmethod.id === result.testmethod
          )?.name;
      } else {
        testMethodName = "unsupported";
      }

      tableRows.push(
        <Block
          flex
          column
          marginTop={24}
          marginLeft={32}
          paddingTop={24}
          paddingLeft={45}
          paddingRight={45}
          paddingBottom={24}
          border={`3.5px solid ${
            failedSubmittingResults.includes(result.testid)
              ? colors.error.main
              : colors.text.default
          }`}
          radius="12px"
          width="1103px"
          height="180px"
          key={`${result.testid}-${index}`}
        >
          <Block flex spaceBetween row>
            <Block>
              <Text h5>{testMethodName as string}</Text>
              <Text h6 style={{ fontWeight: 600 }}>
                {result.testid}
              </Text>
            </Block>
            <Block marginTop={-24} marginRight={-45}>
              {failedSubmittingResults.includes(result.testid) ? (
                <ViewResultMsg
                  text={t("errors.failedToUpload")}
                  icon={<AlertRounded />}
                  bgColor={colors.error.main}
                  iconBgColor={"#FFF"}
                />
              ) : null}
              {result.submitted ? (
                <ViewResultMsg
                  text={t("results.upload")}
                  icon={<CloudSmall />}
                  bgColor={colors.text.default}
                  iconBgColor={undefined}
                />
              ) : null}
            </Block>
          </Block>

          <Block marginTop={24} flex row spaceBetween alignCenter>
            <Block>
              <Text h5>Test: {testMethodName as string}</Text>
              <Block flex row>
                <Text h5>{t("common.started")}:&nbsp;</Text>
                <Text h5 style={{ fontWeight: 500 }}>
                  {result.testStarted.toLocaleString()}
                </Text>
              </Block>
            </Block>
            <Block flex row alignCenter gap={16}>
              <Button
                onClick={() => viewResult(result.testid, result.submitted)}
                outlined
                height="56px"
                width="194px"
              >
                <Text
                  h4
                  color={colors.primary.main}
                  style={{ fontWeight: 600 }}
                >
                  {t("results.viewResults")}
                </Text>
              </Button>
              <Button
                onClick={() => {
                  setTestid(result.testid);
                  submitResult(result.testid, result.submitted);
                }}
                height="56px"
                width="194px"
                disable={result.isSubmitting ? true : false}
              >
                <Text h4 white style={{ fontWeight: 600 }}>
                  {result.isSubmitting ? (
                    <OvalSpinner size="30px" />
                  ) : (
                    t("results.saveToUSB")
                  )}
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
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
  // useSticky({ top: 70, id: "stickyHeader", stickyClass: "ResultList" });
  return (
    <>
      {/* {(submitting || reading) && (
        <Block grid center height="90vh" alignCenter>
          <OvalSpinner size="100px" />
        </Block>
      )} */}
      <Block flex column height={"100vh"} scrollY>
        <Block
          flex
          spaceBetween
          paddingTop={32}
          paddingLeft={32}
          paddingRight={145}
        >
          <Text h2 style={{ fontWeight: 700 }}>
            {t("resultList.title")}
          </Text>

          <Block flex alignCenter>
            <Text h4 style={{ fontWeight: 700 }}>
              {t("resultList.onlyPending")}
            </Text>
            <Toggle
              isOn={submitFilter}
              handleToggle={() => handleSubmitToggleChange()}
            />
          </Block>
        </Block>
        <Block marginBottom={100}>
          {tableRows.map((tables, index) => {
            return <Block key={index}>{tables}</Block>;
          })}
        </Block>
        {/* <Errors /> */}
      </Block>
    </>
  );
};

export default ResultList;
