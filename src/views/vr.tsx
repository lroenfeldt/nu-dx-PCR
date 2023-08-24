import React, { useState, useEffect } from 'react';
import { BiListUl } from 'react-icons/bi';
import { hexToRGB } from '../utils/helper';
import { Oval } from 'react-loader-spinner';
import { VscGraphLine } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { TbGripHorizontal } from 'react-icons/tb';
import { parseResults } from '../utils/parseResults';
import { useData, useTranslation, useResults } from '../hooks';
import urls from '../config/settings';
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
} from '../components';
import { IBarcode, IError, ITestMethod, TableRow } from '../types/interfaces/interfaces';
import { IConfigFile, ITestProcedure, } from '../types/interfaces/settings';
import {IParameter} from '../types/interfaces/parseResults';

const ViewResults = () => {
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
  const [testmethod, setTestmethod] = useState<ITestMethod | null>(null);
  const [testLoaded, setTestLoaded] = useState<boolean>(false);
  const { checkUSB, saveToUSB } = useResults();
  const navigate = useNavigate();
  const { t, locale } = useTranslation();

  const handleViewResults = (view:string) => {
    setViewResults(view);
  };

  const getBarcode = (id:number) => {
    barcodes.map((barcode) => {
      if (barcode.id === id) {
        setActiveBarcode(barcode);
        window.api.logEvents(JSON.stringify(barcode), 'logInfos.txt');
      }
    });
  };

  const displayResults = async () => {
    window.api.logEvents(`displayResults: ${testid}`, 'logInfos.txt');
    //reset errors
    setErrors((prevErrors) => prevErrors.filter((error) => error.type !== 'submit'));

    //init data
     let resultFile: string;
    let testConfig: IConfigFile;
    let testmethod: ITestProcedure;
    let override: Record<string, string>;

    try {
      let fetchResult = await window.api.getResult(testid, testDone);
      resultFile = fetchResult.resultFile;
      override = fetchResult.override;

      const configFile = fetchResult.configFile;
      testConfig = JSON.parse(configFile);
      if (!testConfig.testmethod) {
        testConfig.testmethod = urls.TESTMETHOD;
      }
      testmethod = settings.account.testprocedures.find((procedure) => procedure.id === testConfig.testmethod)as ITestProcedure;
      setTestmethod(testmethod);

      setSelectedMethod(testmethod.id);
    } catch (err) {
      console.log(err);
      window.api.logEvents(`fetchResult: ${err}`, 'logErrors.txt');
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== 'read')
          .concat({
            type: 'read',
            message: t('errors.failedToReadTestData'),
          })
      );
      return;
    }

    //Parse Results
    try {
      let parsedResults = parseResults(resultFile, testid, testConfig, testmethod, override);
      window.api.logEvents(`parseResults: ${JSON.stringify(parsedResults)}`, 'logInfos.txt');

      let newBarcodes = barcodes.map((barcode) => {
        const { posName }:{posName: any} = barcode;
        if (parsedResults[posName]) {
          return {
            ...barcode,
            oldResult: String(parsedResults[posName].oldResult),
            result: String(parsedResults[posName].result),
            label: String(parsedResults[posName].label),
            value: String(parsedResults[posName].barcode),
            parameters: (parsedResults[posName].parameters) as unknown as IParameter[],
            alteredResult: String(parsedResults[posName].alteredResult),
          };
        }else {
          return barcode;
        }
      });
      //console.log(newBarcodes);
      setBarcodes(newBarcodes as IBarcode[]);
      setTestLoaded(true);
      setActive((prevActive) => (prevActive == 0 ? 1 : prevActive));
    } catch (err) {
      console.log(err);
      window.api.logEvents(`parseResults: ${err}`, 'logErrors.txt');
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== 'submit')
          .concat({
            type: 'submit',
            message: t('errors.failedToReadResultData'),
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
     let result: string | string[] = '';
    if (testmethod && testmethod.type && testmethod.type === 'SNP') {
     result = activeBarcode.result === 'invalid' ? '-' : activeBarcode.result;
    }

     if (testmethod && testmethod.type === 'Absolute') {
      result = testmethod.parameters.map((parameter) => {
        const { target }:{target:any} = parameter;
    
        if (parameter.isPrimary && activeBarcode && 'parameters' in activeBarcode) {
          const directCT = activeBarcode.parameters?.[target]?.ct || "-";
          const lowercaseCT = activeBarcode.parameters?.[target.toLowerCase()]?.ct || "-";
    
          return directCT || lowercaseCT;
        }
    
        return '-';
      });
    }

    return (
      <>
        <div className={`ViewResults `}>
          <div className={`ViewResultsHeader`}>
            <h3 style={{ textAlign: 'start' }}>
              {viewResults == 'graph' ? t('viewResults.instructions') : t('viewResults.instructions2')}
            </h3>

            <Block row align="center">
              <div
                className="viewToggle-left"
                style={{
                  opacity: viewResults == 'graph' ? 1 : 0.5,
                }}
                onClick={() => handleViewResults('graph')}
              >
                <TbGripHorizontal style={{ width: 70, fontWeight: 'bolder' }} size={55} />
              </div>
              <div
                className="viewToggle-right"
                style={{
                  opacity: viewResults == 'table' ? 1 : 0.5,
                }}
                onClick={() => handleViewResults('table')}
              >
                <BiListUl style={{ width: 70 }} size={55} />
              </div>
            </Block>
          </div>
          {viewResults === 'graph' && (
            <>
              <RackVisualRows markActive={setActive} active={active} testmethod={testmethod} showResults={true} />
              <ResultsFooter
                activeBarcode={ activeBarcode as IBarcode}
                testmethod={testmethod as ITestProcedure}
                settings={settings}
                barcodes={barcodes}
                locale={locale}
                navigate={navigate}
              />
            </>
          )}
          {/* TABLE VIEW */}
          {viewResults === 'table' && (
            <Table
              th={[
                'Position',
                t('common.barcode'),
                ...testmethod.parameters.map((parameter) => {
                  return parameter.showCT && 'CT-' + parameter.label;
                }),
                ...testmethod.parameters.map((parameter) => {
                  return parameter.showFL && 'FL-' + parameter.label;
                }),
                t('common.result'),
                testmethod.showCurves && '',
              ]}
              tr={[
                ...barcodes.map((barcode) => {
                  return [
                    barcode.posName,
                    barcode.value,
                    ...testmethod.parameters.map((parameter) => {
                      return parameter.showCT
                        ? barcode.parameters?.[parameter.target]
                          ? barcode.parameters?.[parameter.target]?.ct
                          : barcode.parameters?.[parameter.target.toLowerCase()]?.ct
                        : false;
                    }),
                    ...testmethod.parameters.map((parameter) => {
                      return parameter.showFL
                        ? barcode.parameters?.[parameter.target]
                          ? parseInt(barcode.parameters?.[parameter.target]?.finalCycle)
                          : parseInt(barcode.parameters?.[parameter.target.toLowerCase()]?.finalCycle)
                        : false;
                    }),
                    barcode.result && testmethod.showResults ? (
                      <Block row gap={4}>
                        <div
                          key={barcode.id.toString()}
                          className="resultBadge-table"
                          style={{
                            ...(barcode.alteredResult && { border: '1px solid orange' }),
                            position:
                              barcode.alteredResult || barcode.label == 'NTC' || barcode.label == 'TPC'
                                ? 'relative'
                                : '',
                            color:
                              barcode.result == 'invalid'
                                ? 'orange'
                                : testmethod.results.find((result) => result.name.includes(barcode.result))?.color,
                            border: '1px solid orange',
                            borderColor:
                              barcode.result == 'invalid'
                                ? 'orange'
                                : testmethod.results.find((result) => result.name.includes(barcode.result))?.color,
                            backgroundColor: hexToRGB(
                              testmethod.results.find((result) => result.name.includes(barcode.result))?.color,
                              0.1
                            ),
                            minWidth: 114,
                            fontSize: 'small',
                          }}
                        >
                          {barcode.result == 'invalid'
                            ? 'invalid'
                            : testmethod.results.find((result) => result.name.includes(barcode.result))[
                                'label' + locale?.toUpperCase()
                              ] || barcode.result.toUpperCase()}
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
                              height: '100%',
                            }}
                          />
                          <Checkmark
                            barcode={barcode}
                            style={{
                              top: 20,
                              right: -9,
                              width: 20,
                              height: 20,
                              color: 'white',
                            }}
                          />
                        </div>
                        <ChangeResults activeBarcode={barcode} testmethod={testmethod} isTable={true} />
                      </Block>
                    ) : (
                      ''
                    ),

                    testmethod.showCurves && (
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
              ]}
            />
          )}

          <ButtonArea>
            <Button onClick={() => window.history.go(-1)}>{t('common.back')}</Button>
            {/* {USBPresent ?  <button onClick={() => saveToUSB()}>Auf USB Speichern</button> :  <button className='disabled' onClick={() => saveToUSB()}>Auf USB Speichern</button>} */}
          </ButtonArea>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="ViewResults">
          <div className="spinnerContainer">
            <Oval height="50" width="50" color="var(--primary)" />
          </div>
        </div>
      </>
    );
  }
};

export default ViewResults;
