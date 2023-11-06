import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parseResults } from "../utils/parseResults";
import { useData, useTranslation, useResults } from "../hooks";
import urls from "../config/settings";
import {
  Table,
  Block,
  Button,
  RackVisualRows,
  ChangeResults,
  AlteredResult,
  ResultsFooter,
  Graph,
  Text,
} from "../components";
import {
  IBarcode,
  IError,
  ITestMethod,
  TableRow,
} from "../types/interfaces/interfaces";
import { IConfigFile, ITestProcedure } from "../types/interfaces/settings";
import { useTheme } from "../assets/theme";
import { Bulb } from "../components/Icons";
import OvalSpinner from "../components/OvalSpinner";

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
    viewType,
    setViewResults,
    setSelectedMethod,
  } = useData();
  const [testmethod, setTestmethod] = useState<ITestMethod | null>(null);
  const [testLoaded, setTestLoaded] = useState<boolean>(false);
  const { checkUSB, saveToUSB } = useResults();
  const navigate = useNavigate();
  const { t, locale } = useTranslation();
  const { colors } = useTheme();
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
      setErrors((prevErrors: IError[]) =>
        prevErrors
          .filter((error) => error.type !== "read")
          .concat({
            type: "read",
            message: t("errors.failedToReadTestData"),
          })
      );
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

      setBarcodes(newBarcodes as IBarcode[]);
      setTestLoaded(true);
      setActive((prevActive) => (prevActive == 0 ? 1 : prevActive));
    } catch (err) {
      console.log(err);
      window.api.logEvents(`parseResults: ${err}`);
      setErrors((prevErrors: IError[]) =>
        prevErrors
          .filter((error) => error.type !== "submit")
          .concat({
            type: "read",
            message: t("errors.failedToReadResultData"),
          })
      );
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
      <Block flex center width={"100%"} height={"100%"}>
        <Block flex column center gap={40}>
          {viewType === "sample" && (
            <>
              <Block flex column align="flex-center" width={659}>
                <Text h1>{t("common.results")}:</Text>
                <Block flex gap={16} align="center" alignSelf="strech">
                  <Bulb /> <Text>{t("viewResults.instructions")}</Text>
                </Block>
              </Block>
              <RackVisualRows
                markActive={setActive}
                active={active}
                testmethod={testmethod}
                showResults={true}
              />
              <ResultsFooter
                activeBarcode={activeBarcode as IBarcode}
                testmethod={testmethod as ITestProcedure}
                settings={settings}
                barcodes={barcodes}
                locale={locale}
                navigate={navigate}
              />
            </>
          )}
          {/* TABLE VIEW */}
          {viewType === "list" && (
            <Block flex center marginTop={100} height={"100%"}>
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
                        barcode.result &&
                        testmethod &&
                        testmethod.showResults ? (
                          <>
                            <Block
                              key={barcode.id.toString()}
                              height={36}
                              radius={8}
                              padding="0 16px"
                              style={{
                                ...(barcode.alteredResult && {
                                  border: `3px solid ${colors.text.default}`,
                                }),
                                border:
                                  barcode.result == "invalid"
                                    ? `3px solid ${colors.text.default}`
                                    : "",
                                backgroundColor:
                                  barcode.result == "invalid"
                                    ? colors.test.invalid
                                    : barcode.result == "positive"
                                    ? colors.test.positive
                                    : colors.test.negative,
                              }}
                            >
                              <Text
                                h4
                                style={{
                                  color:
                                    barcode.result == "invalid"
                                      ? colors.text.default
                                      : "#fff",
                                }}
                              >
                                {barcode.result == "positive"
                                  ? "+"
                                  : barcode.result == "negative"
                                  ? "-"
                                  : ""}
                                {barcode.result === "invalid"
                                  ? "invalid"
                                  : (testmethod
                                      ? testmethod.results.find((result) =>
                                          result.name.includes(barcode.result)
                                        )?.["label" + locale?.toLowerCase()]
                                      : undefined) ||
                                    barcode.result.toLowerCase()}
                              </Text>

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
                            </Block>
                            <ChangeResults
                              activeBarcode={barcode}
                              testmethod={testmethod}
                              isTable={true}
                            />
                          </>
                        ) : (
                          ""
                        ),

                        testmethod && testmethod.showCurves && (
                          <Button
                            onClick={() =>
                              navigate(`/viewCurves/${barcode.id}`)
                            }
                            outlined
                          >
                            <Graph />
                          </Button>
                        ),
                      ];
                    }),
                  ] as TableRow[]
                }
              />
            </Block>
          )}
        </Block>
      </Block>
    );
  } else {
    return (
      <div className="ViewResults">
        <OvalSpinner size="50px" />
      </div>
    );
  }
};

export default ViewResults;
