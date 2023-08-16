import { useState, useEffect } from 'react';
import { BiListUl } from 'react-icons/bi';
import { hexToRGB } from '../utils/helper';
import { Oval } from 'react-loader-spinner';
import { VscGraphLine } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { TbGripHorizontal } from 'react-icons/tb';
import { parseResultsDisplay } from '../utils/parseResults';
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
import { IBarcode, IError, IParsedResults } from '../types/interfaces/interfaces';
import { Testprocedure } from '../types/interfaces/settings';

const ViewResults = () => {
  const [active, setActive] = useState(0);
  const [activeBarcode, setActiveBarcode] = useState<IBarcode>();
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

  const [testmethod, setTestmethod] = useState(null);
  const [testLoaded, setTestLoaded] = useState(false);
  const { checkUSB }: any = useResults();
  const navigate = useNavigate();

  const { t, locale } = useTranslation();

  const handleViewResults = (view: string) => {
    setViewResults(view);
  };

  const getBarcode = (id: number) => {
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
    setErrors((prevErrors: IError[]) => prevErrors.filter((error) => error.type !== 'submit'));

    //init data
    let resultFile, testConfig: { testmethod: string }, testmethod: Testprocedure | undefined, override;

    try {
      let fetchResult = await window.api.getResult(testid, testDone);
      resultFile = fetchResult.resultFile;
      override = fetchResult.override;

      const configFile = fetchResult.configFile;
      testConfig = JSON.parse(configFile);
      if (!testConfig.testmethod) {
        testConfig.testmethod = urls.TESTMETHOD;
      }
      testmethod = settings.account.testprocedures.find((procedure) => procedure.id === testConfig.testmethod);
      setTestmethod(testmethod);

      setSelectedMethod(testmethod.id);
    } catch (err) {
      console.log(err);
      window.api.logEvents(`fetchResult: ${err}`, 'logErrors.txt');
      setErrors((prevErrors: IError[]) =>
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
      let parsedResults: IParsedResults = parseResultsDisplay(
        resultFile,
        testid as string,
        testConfig,
        testmethod as Testprocedure,
        override
      ) as IParsedResults;
      window.api.logEvents(`parseResults: ${JSON.stringify(parsedResults)}`, 'logInfos.txt');

      let newBarcodes = barcodes.map((barcode) => {
        if (parsedResults[barcode.posName]) {
          return {
            ...barcode,
            oldResult: parsedResults[barcode.posName].oldResult,
            result: parsedResults[barcode.posName].result,
            label: parsedResults[barcode.posName].label,
            value: parsedResults[barcode.posName].barcode,
            parameters: parsedResults[barcode.posName].parameters,
            alteredResult: parsedResults[barcode.posName].alteredResult,
          };
        } else {
          return barcode;
        }
      });
      //console.log(newBarcodes);
      setBarcodes(newBarcodes);
      setTestLoaded(true);
      setActive((prevActive) => (prevActive == 0 ? 1 : prevActive));
    } catch (err) {
      console.log(err);
      window.api.logEvents(`parseResults: ${err}`, 'logErrors.txt');
      setErrors((prevErrors: IError[]) =>
        prevErrors
          .filter((error) => error.type !== 'submit')
          .concat({
            type: 'read',
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
    let result;
    if (testmethod.type && testmethod.type === 'SNP') {
      result = activeBarcode?.result === 'invalid' ? '-' : activeBarcode?.result;
    }

    if (testmethod.type && testmethod.type === 'Absolute') {
      result = testmethod.parameters.map((parameter: { isPrimary: boolean; target: string }) => {
        if (parameter.isPrimary) {
          return activeBarcode?.parameters?.[parameter.target]
            ? activeBarcode.parameters?.[parameter.target]?.ct
            : activeBarcode?.parameters?.[parameter.target.toLowerCase()]?.ct;
        }
      });
    }

    return (
      <>
        <div className={`ViewResults `}>
          <div className={`ViewResultsHeader`}>
            <h3 style={{ textAlign: 'start' }}>
              {viewResults == 'graph' ? t('viewResults.instructions') : t('viewResults.instructions2')}
            </h3>

            <Block
              row={0}
              align="center"
              children={
                <>
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
                </>
              }
            />
          </div>
          {viewResults === 'graph' && (
            <>
              <RackVisualRows markActive={setActive} active={active} testmethod={testmethod} showResults={true} />
              <ResultsFooter
                activeBarcode={activeBarcode}
                testmethod={testmethod}
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
                ...testmethod.parameters.map((parameter: { showCT: boolean; label: string }) => {
                  return parameter.showCT && 'CT-' + parameter.label;
                }),
                ...testmethod.parameters.map((parameter: { showFL: boolean; label: string }) => {
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
                    ...testmethod.parameters.map((parameter: { showCT: boolean; target: string }) => {
                      return parameter.showCT
                        ? barcode.parameters?.[parameter.target]
                          ? barcode.parameters?.[parameter.target]?.ct
                          : barcode.parameters?.[parameter.target.toLowerCase()]?.ct
                        : false;
                    }),
                    ...testmethod.parameters.map((parameter: { showFL: boolean; target: string }) => {
                      return parameter.showFL
                        ? barcode.parameters?.[parameter.target]
                          ? parseInt(barcode.parameters?.[parameter.target]?.finalCycle)
                          : parseInt(barcode.parameters?.[parameter.target.toLowerCase()]?.finalCycle)
                        : false;
                    }),
                    barcode.result && testmethod.showResults ? (
                      <Block
                        gap={4}
                        row={0}
                        children={
                          <>
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
                                    : testmethod.results.find((result: { name: string | string[] }) =>
                                        result.name.includes(barcode.result)
                                      )?.color,
                                border: '1px solid orange',
                                borderColor:
                                  barcode.result == 'invalid'
                                    ? 'orange'
                                    : testmethod.results.find((result: { name: string | string[] }) =>
                                        result.name.includes(barcode.result)
                                      )?.color,
                                backgroundColor: hexToRGB(
                                  testmethod.results.find((result: { name: string | string[] }) =>
                                    result.name.includes(barcode.result)
                                  )?.color,
                                  0.1
                                ),
                                minWidth: 114,
                                fontSize: 'small',
                              }}
                            >
                              {barcode.result == 'invalid'
                                ? 'invalid'
                                : testmethod.results.find((result: { name: string | string[] }) =>
                                    result.name.includes(barcode.result)
                                  )['label' + locale?.toUpperCase()] || barcode.result.toUpperCase()}
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
                                  backgroundColor: undefined,
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
                                isNinetySix={false}
                              />
                            </div>
                            <ChangeResults activeBarcode={barcode} testmethod={testmethod} isTable={true} />
                          </>
                        }
                      />
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

          <ButtonArea
            children={<Button onClick={() => window.history.go(-1)}>{t('common.back')}</Button>}
            noborder={false}
            style={undefined}
          />
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
