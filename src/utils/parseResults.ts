import {
  IBarcode,
  IParameter,
  IParsedResults,
  IParsedResultsData,
  IResultFile,
  ITestMethod,
} from '../types/interfaces/interfaces';
import { Account, Device } from '../types/interfaces/settings';

/**
 * Extract Barcodes from given result file
 * @param {*} resultFile
 * @returns {Array} array of barcodes
 */

export const extractBarcodes = (resultFile: string): IBarcode[] => {
  let extractedBarcodes: IBarcode[] = [];
  let parsedResults = resultFile.split(/\r?\n/);

  //Parse Rows for Results
  const resultsDataStart = parsedResults.indexOf('Quan. Result') + 1;
  let resultsData = parsedResults
    .slice(resultsDataStart)
    .filter((row) => row !== '' && row.substring(0, 4) != 'Well')
    .map((row) => row.split(','));
  //Validate File
  if (!resultsData) {
    throw Error('Invalid Result File, no Barcodes found');
  }
  //Limit to one parameter (remove duplicates)
  const paramFilter = resultsData[0][4];

  resultsData.forEach((row) => {
    if (row[4] === paramFilter) {
      let value = row[1];
      const position = row[0];
      extractedBarcodes.push({
        value,
        position,
        map: function (): unknown {
          throw new Error('Function not implemented.');
        },
        parameters: [],
        label: '',
        checking: false,
        result: '',
        valid: false,
        blocked: false,
        barcode: '',
        posName: '',
        oldResult: '',
        alteredResult: false,
        name: '',
        error: null,
        isControl: undefined,
        askRetest: null,
        id: 0,
      });
    }
  });
  //return barcodes
  return extractedBarcodes;
};

/**
 * Extract Barcodes, parameters, labels, results and positions from given result file and return as object
 * @param {Object} resultFile - The result file to parse
 * @param {string} testid - The testid of the test
 * @param {object} testConfig - The Config file of the test
 * @param {string} testmethod - Test id of the selected testmethod
 * @returns {Object} object of barcodes, parameters, labels, results and positions
 * @example {barcodes: [{value: "123456789", position: "A1", ...}]
 * */
export const parseResults = (
  resultFile: IResultFile,
  testid: string,
  testConfig: {},
  testmethod: string,
  override = false
): object => {
  window.api.logEvents('parsing results', 'logInfos.txt');

  //Check provided Input
  if (!resultFile) throw Error('Invalid resultFile: ' + resultFile);
  if (!testid) throw Error('Invalid testid: ' + testid);
  if (!testConfig) throw Error('Invalid settings: ' + testConfig);
  if (!testmethod) throw Error('Invalid testmethod: ' + testmethod);

  // Check Threshholds and provide fallback
  // let hecThreshFl = testConfig.account.hecThreshFl || 0;
  // let virusThreshFl = testConfig.account.virusThreshFl || 0;

  //split by linebreak
  let parsedResults: IParsedResults = resultFile.split(/\r?\n/);

  //Parse rows for Amp Data
  const resultsRawDataStart = parsedResults.indexOf('Quan. AmpData') + 1;
  const resultsRawDataEnd = parsedResults.indexOf('Quan. Result');
  let resultsRawData = parsedResults
    .slice(resultsRawDataStart, resultsRawDataEnd)
    .filter((row: string) => row !== '' && row.substring(0, 4) != 'Well')
    .map((row: string) => row.split(','));

  //Validate File
  if (!resultsRawData) throw Error('Invalid Result File, no Raw Data found');

  let parsedResultsData: IParsedResultsData[] = [];

  //Read Cycle Values
  resultsRawData.forEach((row: Array<any>) => {
    const position = row[0];
    const parameter = row[4].toUpperCase();
    const curveData = row.slice(5);
    const finalCycle = row.slice(5)[row.slice(5).length - 1];

    //Pass to result object
    if (!parsedResultsData[position]) {
      parsedResultsData[position] = {
        barcode: null,
        parameters: [],
        label: '',
        alteredResult: false,
        oldResult: '',
        isControl: null,
        result: '',
      };
    }

    if (!parsedResultsData[position].parameters) {
      parsedResultsData[position].parameters = [] as IParameter[];
    }

    if (!parsedResultsData[position].parameters?.[parameter]) {
      parsedResultsData[position] = {
        barcode: null,
        parameters: [],
        label: '',
        alteredResult: false,
        oldResult: '',
        isControl: null,
        result: '',
      };
    }
    const testmethod: ITestMethod = {
      showCurves: false,
      parameters: [],
      results: [],
      procedure: '',

      result: '',
      name: '',

      showResults: false,
      type: '',
      resultParameter: '',
      specificationId: '',
    };

    parsedResultsData[position].parameters[parameter].curveData = curveData;
    parsedResultsData[position].parameters[parameter].finalCycle = finalCycle;
    parsedResultsData[position].parameters[parameter].threshhold =
      testmethod.parameters?.find((param: { target: string }) => param.target === parameter)?.threshhold || '';
  });

  //Parse Rows for Results
  const resultsDataStart = parsedResults.indexOf('Quan. Result') + 1;
  const resultsDataEnd =
    parsedResults.indexOf('SNP Result') === -1 ? parsedResults.length + 1 : parsedResults.indexOf('SNP Result');
  let resultsData = parsedResults
    .slice(resultsDataStart, resultsDataEnd)
    .filter(
      (row: string) =>
        row !== '' && row !== 'Well,Sample ID,Property,Target,Dye,Ct,Ct Mean,Ct SD,Concentration,Aver. Con.,Con. SD'
    )
    .map((row: string) => row.split(','));

  //Validate File
  if (!resultsData) throw Error('Invalid Result File, no results found');

  //Read Values
  resultsData.forEach((row: Array<any>, index: string) => {
    let barcode = row[1];
    const position = row[0];
    const parameter = row[4].toUpperCase();
    const ct = row[5];

    parsedResultsData[position].barcode = barcode;
    parsedResultsData[position].parameters[parameter].ct = ct;
    parsedResultsData[position].label = position;
    parsedResultsData[position].alteredResult = false;
    parsedResultsData[position].oldResult = '';
    parsedResultsData[position].isControl = false;
    //Set labels for Controls
    if (['Placeholder_NTC', 'SC2NTC', 'NTC'].includes(barcode)) {
      parsedResultsData[position].label = 'NTC';
      parsedResultsData[position].isControl = true;
    }
    if (['Placeholder_TPC', 'SC2TPC', 'TPC'].includes(barcode)) {
      parsedResultsData[position].label = 'TPC';
      parsedResultsData[position].isControl = true;
    }
  });

  //CALCULATE RESULTS
  Object.keys(parsedResultsData).forEach((position) => {
    //Set default result to invalid
    parsedResultsData[+position].result = 'invalid';

    //Define functions to call upon evaluation
    function CT(param: string) {
      const ctValue = parsedResultsData[+position].parameters[+param]?.ct;
      return Number(ctValue);
    }

    function FL(param: string) {
      const flValue = parsedResultsData[+position].parameters[+param]?.finalCycle;
      return Number(flValue);
    }

    function Thresh(param: string) {
      const threshValue = parsedResultsData[+position].parameters[+param]?.threshhold;
      return Number(threshValue);
    }

    const testmethod: ITestMethod = {
      showCurves: false,
      parameters: [],
      results: [],
      procedure: '',
      result: '',
      name: '',
      showResults: false,
      type: '',
      resultParameter: '',
      specificationId: '',
    };

    //parse result conditions
    testmethod.results?.forEach((resultType: { conditions: string; name: string }) => {
      let conditions = resultType.conditions
        .replaceAll('(', '("')
        .replaceAll(')', '")')
        .replaceAll('hecThresh', 'hecThreshFl')
        .replaceAll('virusThresh', 'virusThreshFl')
        .replaceAll('=', '==')
        .replaceAll('\n', '')
        .split(',')
        .map((s: string) => '(' + s.trim() + ')')
        .join(' && ');

      //Vite does not consider declared and unused functions during compilation, hence the need to write this line to prevent the functions from being ignored.
      CT('ROX') > 0 && CT('ROX') < 40 && (CT('FAM') == 0 || FL('FAM') > 40) && (Thresh('VIC') == 0 || CT('VIC') > 40);

      const passed = eval(conditions);

      if (passed) {
        parsedResultsData[+position].result = resultType.name;
        parsedResultsData[+position].oldResult = resultType.name;
      }
    });

    //Translate NTC Results
    if (parsedResultsData[+position].label === 'NTC' && parsedResultsData[+position].result === 'invalid') {
      parsedResultsData[+position].result = 'negative';
    } else if (parsedResultsData[+position].label === 'NTC' && parsedResultsData[+position].result === 'negative') {
      parsedResultsData[+position].result = 'invalid';
    }

    //Apply Overrides
    if (override && JSON.parse(override.toString())[position]) {
      parsedResultsData[+position].result = JSON.parse(override.toString())[position];
      parsedResultsData[+position].alteredResult = true;
    }
  });

  window.api.logEvents('parsedResultsData: ' + parsedResultsData, 'logInfos.txt');
  //return

  return parsedResultsData;
};

/**
 * Get the results from the result file to be displayed in the results table and the results chart or graph
 * @param {string} resultFile - The result file to parse
 * @param {string} testid - The testid of the test
 * @param {object} testConfig - The Config file of the test
 * @param {Interface} testmethod - Test id of the selected testmethod
 * @returns {object} - The parsed results
 */

export const parseResultsDisplay = (
  resultFile: IResultFile,
  testid: string,
  testConfig: {},
  testmethod: ITestMethod,
  override: boolean | undefined
): object => {
  return parseResults(resultFile, testid, testConfig, testmethod as any, override);
};

/**
 * Parses the results from the result file and calculates the results
 * @param {string} resultFile - The result file to parse
 * @param {string} testid - The testid of the test
 * @param {string} testmethod - testmethod id of the selected testmethod
 * @returns {object} - The parsed results
 */
export const parseResultsExport = (
  resultFile: IResultFile,
  testid: string,
  testConfig: { testmethod: { type: string } },
  testmethod: ITestMethod,
  lotNumber = ''
) => {
  window.api.logEvents(`parseResultsExport settings: ${testConfig}`, 'logInfos.txt');

  const parsedData = parseResults(resultFile, testid, testConfig, testmethod as any);

  //init export file
  let exportFile = '';

  if (testmethod.type === 'Absolute') {
    exportFile += 'Position;Barcode;CT;Result;lotNumber\n';

    //Read Data
    for (let position in parsedData) {
      let data: IParameter = parsedData[position as keyof typeof parsedData];
      // This error occurs because  a `for...in` loop is used to iterate over the properties of an object, but TypeScript
      // doesn't have enough information to determine the types of those properties. To resolve this error,
      // type annotations to specify the types of the object's properties can be added.
      // as keyof typeof

      for (let paramName in data.parameters) {
        let paramData = data.parameters[paramName as keyof typeof data.parameters];

        //Add result entry for each parameter
        exportFile += `${position};${data.barcode};${paramData.ct};${data.result};${lotNumber}\n`;
        break;
      }
    }
  }

  if (testmethod.type === 'SNP') {
    exportFile += 'Position;Barcode;Result\n';

    //Read Data
    for (let position in parsedData) {
      let data: IBarcode = parsedData[position as keyof typeof parsedData];
      exportFile += `${position};${data.barcode};${data.result}\n`;
    }
  }

  //return
  return exportFile;
};

/**
 * Parses the results from the result file and returns the results for submission to the database
 * @param {string} testid - The testid of the test
 * @param {string} resultFile - The result file to parse
 * @param {object} testmethod - testmethod id of the selected testmethod
 * @param {object} testConfig - The Config file of the test
 * @param {Array} autoControls - Test id of the selected testmethod
 * @param {Date} testStarted - Date when the test was started
 * @param {string} userId - The id of the user who started the test
 **/
export const parseResultsDB = (
  testid: string,
  resultFile: IResultFile,
  testmethod: ITestMethod,
  testConfig: { device: Device; account: Account },
  autoControls: {
    forEach(arg0: (autoControl: { position: string; barcode: string | number }) => void): unknown;
    position: string;
    barcode: string | number;
  },
  testStarted: string,
  userId: string,
  override: boolean | undefined,
  lotNumber: string
) => {
  const parsedData = parseResults(resultFile, testid, testConfig, testmethod as any, override);

  let results: any[] = ['Results'];
  let rawData: any[] = ['AmpData'];

  for (let position in parsedData) {
    let data: IBarcode = parsedData[position as keyof typeof parsedData];

    //replace autoControl if present
    autoControls.forEach((autoControl) => {
      if (autoControl.position === position) {
        window.api.logEvents(
          `replacing placeholder barcode"${data.barcode}" with "${autoControl.barcode}" on position "${position}"`,
          'logInfos.txt'
        );
        data.barcode = autoControl.barcode;
      }
    });

    for (let paramName in data.parameters) {
      let paramData = data.parameters[paramName];

      //Add result entry for each parameter
      results.push({
        barcode: data.barcode,
        device: testConfig.device.hardwareId,
        run: testid,
        position,
        parameter:
          testmethod.parameters?.find((param: { target: string }) => param.target === paramName)?.dbTransformation ||
          paramName,
        ct: paramData.ct,
        testStarted,
        orderKey: testConfig.account.orderKey,
        threshhold:
          testmethod.parameters?.find((param: { target: string }) => param.target === paramName)?.threshhold || '',
        hecThreshFl: testConfig.account?.hecThreshFl,
        virusThreshFl: testConfig.account.virusThreshFl,
        userId,
        testmethod: testmethod.id,
        result: '',
        alteredResult: data.alteredResult,
        wellCount: testConfig.device.wellCount,
        isControl: data.isControl,
      });

      //Add curve entries for each parameter
      paramData.curveData.forEach((value, index) => {
        rawData.push({
          barcode: data.barcode,
          parameter:
            testmethod.parameters?.find((param: { target: string }) => param.target === paramName)?.dbTransformation ||
            paramName,
          cycle: index + 1,
          value: parseFloat(value).toFixed(3),
        });
      });
    }

    //Add Result parameter
    results.push({
      barcode: data.barcode,
      device: testConfig.device.hardwareId,
      run: testid,
      position,
      parameter: testmethod.resultParameter,
      ct: '',
      testStarted,
      orderKey: testConfig.account.orderKey,
      threshhold: '',
      hecThreshFl: testConfig.account?.hecThreshFl,
      virusThreshFl: testConfig.account.virusThreshFl,
      userId,
      testmethod: testmethod.id,
      result: data.result,
      alteredResult: data.alteredResult,
      wellCount: testConfig.device.wellCount,
      specificationId: testmethod.specificationId,
      isControl: data.isControl,
      lotNumber,
    });
  }

  const dbSubmit = results.concat(rawData);
  return dbSubmit;
};
