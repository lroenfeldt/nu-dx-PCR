import React, { useState, useEffect } from "react";
import { BiListUl } from "react-icons/bi";
import { hexToRGB } from "../utils/helper";
import { Oval } from "react-loader-spinner";
import { VscGraphLine } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { TbGripHorizontal } from "react-icons/tb";
import { parseResults } from "../utils/parseResults";
import { useData, useTranslation, useResults } from "../hooks";
import urls from "../config/settings";
import {
  Table,
  Block,
  Checkmark,
  ButtonArea,
  Button,
  RackVisualRows,
  ChangeResults,
  AlteredResult,
  ResultsFooter,
} from "../components";
import {
  IBarcode,
  IError,
  ITestMethod,
  TableRow,
} from "../types/interfaces/interfaces";
import { IConfigFile, ITestProcedure } from "../types/interfaces/settings";
import { useErrors } from "../hooks/useErrors";

const ViewResults: React.FC = () => {
  const [active, setActive] = useState<number>(0);
  const [activeBarcode, setActiveBarcode] = useState<IBarcode | {}>({});
  const {
    testid,
    barcodes,
    settings,
    testDone,
    setErrors,
    setBarcodes,
    viewResults,
    setViewResults,
    setSelectedMethod,
  } = useData();
  const { failedToReadTestData, failedToReadResultData, registerErrors } =
    useErrors();
  const [testmethod, setTestmethod] = useState<ITestMethod | null>(null);
  const [testLoaded, setTestLoaded] = useState<boolean>(false);
  const { checkUSB } = useResults();
  const navigate = useNavigate();
  const { t, locale } = useTranslation();

  const handleViewResults = (view: string) => {
    setViewResults(view);
  };

  const getBarcode = (id: number) => {
    barcodes.map((barcode) => {
      if (barcode.id === id) {
        setActiveBarcode(barcode);
        window.api.logEvents(JSON.stringify(barcode));
      }
    });
  };

  const displayResults = async () => {
    window.api.logEvents(`displayResults: ${testid}`);
    //reset errors
    setErrors((prevErrors: IError[]) =>
      prevErrors.filter((error) => error.type !== "submit")
    );

    //init data
    let resultFile: string;
    let testConfig: IConfigFile;
    let testmethod: ITestProcedure;
    let override: string;

    try {
      let fetchResult = await window.api.getResult(testid, testDone);
      resultFile = fetchResult.resultFile;
      override = fetchResult.override;

      const configFile = fetchResult.configFile;
      testConfig = JSON.parse(configFile);
      if (!testConfig.testmethod) {
        testConfig.testmethod = urls.TESTMETHOD;
      }
      testmethod = settings.account.testprocedures.find(
        (procedure: ITestProcedure) => procedure.id === testConfig.testmethod
      ) as ITestProcedure;

      setTestmethod(testmethod);

      setSelectedMethod(testmethod.id);
    } catch (err) {
      console.log(err);
      window.api.logEvents(`fetchResult: ${err}`);
      registerErrors(failedToReadTestData);
      return;
    }

    //Parse Results
    try {
      let parsedResults = parseResults(
        resultFile,
        testid,
        testConfig,
        testmethod,
        override
      );

      let newBarcodes = barcodes.map((barcode) => {
        const { posName } = barcode;
        if (parsedResults[posName]) {
          return {
            ...barcode,
            oldResult: parsedResults[posName].oldResult,
            result: parsedResults[posName].result,
            label: parsedResults[posName].label,
            value: parsedResults[posName].barcode,
            parameters: parsedResults[posName].parameters,
            alteredResult: parsedResults[posName].alteredResult,
          };
        } else {
          return barcode;
        }
      });

      //console.log(newBarcodes);

      setBarcodes(newBarcodes as IBarcode[]);
      setTestLoaded(true);
      setActive((prevActive) => (prevActive == 0 ? 1 : prevActive));
    } catch (err) {
      console.log(err);
      window.api.logEvents(`parseResults: ${err}`);
      registerErrors(failedToReadResultData);
      return;
    }
  };

  //Check if USB is Present
  useEffect(() => {
    checkUSB();
    const clearcheckUSB = setInterval(() => checkUSB(), 3000);
    return () => clearInterval(clearcheckUSB);
  }, []);

  //load result data on startup
  useEffect(() => {
    displayResults();
  }, [testid, settings.account.testprocedures]);

  //set active barcode
  useEffect(() => {
    getBarcode(active);
  }, [active]);

  if (testLoaded) {
    let result: string | string[] = "";
    if (testmethod && testmethod.type && testmethod.type === "SNP") {
      if (activeBarcode && "result" in activeBarcode) {
        result =
          activeBarcode.result === "invalid" ? "-" : activeBarcode.result;
      }
    }

    if (testmethod && testmethod.type === "Absolute") {
      result = testmethod.parameters.map((parameter) => {
        const { target }: { target: any } = parameter;

        if (
          parameter.isPrimary &&
          activeBarcode &&
          "parameters" in activeBarcode
        ) {
          const directCT = activeBarcode.parameters?.[target]?.ct || "-";
          const lowercaseCT =
            activeBarcode.parameters?.[target.toLowerCase()]?.ct || "-";

          return directCT || lowercaseCT;
        }

        return "-";
      });
    }

    return (
      <>
        <div className={`ViewResults `}>
          <div className={`ViewResultsHeader`}>
            <h3 style={{ textAlign: "start" }}>
              {viewResults == "graph"
                ? t("viewResults.instructions")
                : t("viewResults.instructions2")}
            </h3>

            <Block row={true} align="center">
              <>
                <div
                  className="viewToggle-left"
                  style={{
                    opacity: viewResults == "graph" ? 1 : 0.5,
                  }}
                  onClick={() => handleViewResults("graph")}
                >
                  <TbGripHorizontal
                    style={{ width: 70, fontWeight: "bolder" }}
                    size={55}
                  />
                </div>
                <div
                  className="viewToggle-right"
                  style={{
                    opacity: viewResults == "table" ? 1 : 0.5,
                  }}
                  onClick={() => handleViewResults("table")}
                >
                  <BiListUl style={{ width: 70 }} size={55} />
                </div>
              </>
            </Block>
          </div>
          {viewResults === "graph" && (
            <>
              <RackVisualRows
                markActive={setActive}
                active={active}
                testmethod={testmethod as ITestProcedure}
                showResults={true}
              />
              <ResultsFooter
                activeBarcode={activeBarcode as IBarcode}
                testmethod={testmethod as ITestProcedure}
              />
            </>
          )}
          {/* TABLE VIEW */}
          {viewResults === "table" && (
            <Table
              th={[
                "Position",
                t("common.barcode"),
                ...((testmethod &&
                  testmethod.parameters.map((parameter) => {
                    return parameter.showCT && "CT-" + parameter.label;
                  })) ||
                  []),
                ...((testmethod &&
                  testmethod.parameters.map((parameter) => {
                    return parameter.showFL && "FL-" + parameter.label;
                  })) ||
                  []),
                t("common.result"),
                testmethod && testmethod.showResults ? "Graph" : "",
              ]}
              tr={
                [
                  ...barcodes.map((barcode) => {
                    return [
                      barcode.posName,
                      barcode.value,
                      ...((testmethod &&
                        testmethod.parameters.map((parameter) => {
                          const { target }: { target: any } = parameter;
                          return parameter.showCT
                            ? barcode.parameters?.[target]
                              ? barcode.parameters?.[target]?.ct
                              : barcode.parameters?.[target.toLowerCase()]?.ct
                            : false;
                        })) ||
                        []),
                      ...((testmethod &&
                        testmethod.parameters.map((parameter) => {
                          const { target }: { target: any } = parameter;
                          return parameter.showFL
                            ? barcode.parameters?.[target]
                              ? parseInt(
                                  barcode.parameters?.[target]?.finalCycle
                                )
                              : parseInt(
                                  barcode.parameters?.[target.toLowerCase()]
                                    ?.finalCycle
                                )
                            : false;
                        })) ||
                        []),
                      barcode.result && testmethod && testmethod.showResults ? (
                        <Block row gap={4}>
                          <div
                            key={barcode.id.toString()}
                            className="resultBadge-table"
                            style={{
                              ...(barcode.alteredResult && {
                                border: "1px solid orange",
                              }),
                              position: "relative",
                              color:
                                barcode.result == "invalid"
                                  ? "orange"
                                  : testmethod.results.find((result) =>
                                      result.name.includes(barcode.result)
                                    )?.color,
                              border: "1px solid orange",
                              borderColor:
                                barcode.result == "invalid"
                                  ? "orange"
                                  : testmethod.results.find((result) =>
                                      result.name.includes(barcode.result)
                                    )?.color,
                              backgroundColor: hexToRGB(
                                (testmethod &&
                                  testmethod.results.find((result) =>
                                    result.name.includes(barcode.result)
                                  )?.color) ||
                                  "orange",
                                0.1
                              ),
                              minWidth: 114,
                              fontSize: "small",
                            }}
                          >
                            {barcode.result === "invalid"
                              ? "invalid"
                              : (testmethod
                                  ? testmethod.results.find((result) =>
                                      result.name.includes(barcode.result)
                                    )?.["label" + locale?.toUpperCase()]
                                  : undefined) || barcode.result.toUpperCase()}

                            <AlteredResult
                              activeBarcode={barcode}
                              testmethod={testmethod}
                              style={{
                                right: -1,
                                top: 0,
                                bottom: -1,
                                borderRadius: 4,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                height: "100%",
                              }}
                            />

                            <Checkmark
                              testmethod={testmethod}
                              barcode={barcode}
                              style={{
                                top: 20,
                                right: -9,
                                width: 20,
                                height: 20,
                                color: "white",
                              }}
                            />
                          </div>
                          <ChangeResults
                            activeBarcode={barcode}
                            testmethod={testmethod}
                            isTable={true}
                          />
                        </Block>
                      ) : (
                        ""
                      ),

                      testmethod && testmethod.showCurves && (
                        <div
                          key={barcode.id.toString()}
                          className="viewCurve"
                          onClick={() => navigate(`/viewCurves/${barcode.id}`)}
                        >
                          <VscGraphLine />
                        </div>
                      ),
                    ];
                  }),
                ] as TableRow[]
              }
            />
          )}

          <ButtonArea>
            <Button onClick={() => window.history.go(-1)}>
              {t("common.back")}
            </Button>
            {/* {USBPresent ?  <button onClick={() => saveToUSB()}>Auf USB Speichern</button> :  <button className='disabled' onClick={() => saveToUSB()}>Auf USB Speichern</button>} */}
          </ButtonArea>
        </div>
      </>
    );
  } else {
    return (
      <div className="ViewResults">
        <div className="spinnerContainer">
          <Oval height={50} width="50" color="var(--primary)" />
        </div>
      </div>
    );
  }
};

export default ViewResults;
