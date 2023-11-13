import { useCallback, useEffect, useRef, useState } from "react";
import {
  Block,
  Button,
  Errors,
  Modal,
  Prev,
  Text,
  Toggle,
} from "../components";
import { useNavigate } from "react-router-dom";
import { useData, useTheme, useTranslation } from "../hooks";
import { AiFillUsb } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { useResults } from "../hooks";
import urls from "../config/settings";
import OvalSpinner from "../components/OvalSpinner";
import AlertRounded from "../components/Icons/AlertRounded";
import ViewResultMsg from "../components/ViewResultMsg";
import CloudSmall from "../components/Icons/CloudSmall";
import Export from "../components/Icons/Export";
import ViewResultsModal from "../components/ViewResultsModal";

const ResultList = () => {
  const navigate = useNavigate();
  const {
    USBPresent,
    settings,
    setTestid,
    resetBarcodes,
    setTestDone,
    submitFilter,
    setSubmitFilter,
    results,
    failedSubmittingResults,
    testid,
    setErrors,
    openMenu,
    setOpenMenu,
  } = useData();
  const { checkUSB, saveToUSB, getResults, submitResult } = useResults();
  const { t, locale } = useTranslation();
  const { colors } = useTheme();

  const [resultSubmitted, setResultSubmitted] = useState<boolean>(false);

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

  const startPoint = useRef<HTMLDivElement>(null);
  const scroll = (direction: "up" | "down") => {
    const el = startPoint.current;
    if (!el) return;

    const scrollHeight = 150;
    const scrollAmount = direction === "up" ? -scrollHeight : scrollHeight;

    el.scrollBy({
      top: scrollAmount,
      behavior: "smooth",
    });
  };

  const openError = () => {
    setErrors((prevErrors) =>
      prevErrors
        .filter((error) => error.type !== "submit")
        .concat({
          type: "submit",
          message: t("errors.failedToSaveControlSample"),
        })
    );
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
      }

      // |-------><-------|

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
                <Block cursor onClick={openError}>
                  <ViewResultMsg
                    text={t("errors.failedToUpload")}
                    icon={<AlertRounded />}
                    bgColor={colors.error.main}
                    iconBgColor={"#FFF"}
                  />
                </Block>
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
                  setResultSubmitted(result.submitted);
                  setOpenMenu(true);
                }}
                height="56px"
                width="240px"
              >
                <Block flex center row gap={8} alignCenter>
                  <Export />
                  <Text h4 white style={{ fontWeight: 600 }}>
                    {t("results.saveToUSB")}
                  </Text>
                </Block>
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
  return (
    <>
      <Block
        position="absolute"
        top={"50%"}
        right={-75}
        transform="rotate(90deg)"
        flex
        row
        center
        alignCenter
        gap={100}
      >
        <Block
          transition="all 0.3s ease-in-out"
          border="0px solid transparent"
          cursor
          onClick={() => scroll("up")}
        >
          <Prev />
        </Block>
        <Block
          transform="scaleX(-1)"
          transition="all 0.3s ease-in-out"
          border="0px solid transparent"
          cursor
          onClick={() => scroll("down")}
        >
          <Prev />
        </Block>
      </Block>
      <Block ref={startPoint} flex column height={"100vh"} scrollY>
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
        <Errors />
        {openMenu ? (
          <Modal isVisible={openMenu} setIsvisible={() => setOpenMenu(false)}>
            <ViewResultsModal
              onClose={() => setOpenMenu(false)}
              onCloudExport={() => {
                submitResult(testid, resultSubmitted);
              }}
              onCSVExport={() => saveToUSB(testid, resultSubmitted)}
              onPDFExport={() => saveToUSB(testid, resultSubmitted)}
            />
          </Modal>
        ) : null}
      </Block>
    </>
  );
};

export default ResultList;
