import axios from 'axios';

/**
 * Extract Barcodes from given result file
 * @param {*} resultFile
 * @returns {Array} array of barcodes
 */

export const extractBarcodes = (resultFile) => {
  let extractedBarcodes = [];
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
      extractedBarcodes.push({ value, position });
    }
  });
  //return barcodes
  return extractedBarcodes;
};

/**
 * Extract Barcodes, parameters, labels, results and positions from given result file and return as object
 * @param {string} resultFile - The result file to parse
 * @param {string} testid - The testid of the test
 * @param {object} testConfig - The Config file of the test
 * @param {string} testmethod - Test id of the selected testmethod
 * @returns {Object} object of barcodes, parameters, labels, results and positions
 * @example {barcodes: [{value: "123456789", position: "A1", ...}]
 * */
export const parseResults = (resultFile, testid, testConfig, testmethod, override = false) => {
  console.log('parsing results');
  window.api.logEvents('parsing results', 'logInfos.txt');

  //Check provided Input
  if (!resultFile) throw Error('Invalid resultFile: ' + resultFile);
  if (!testid) throw Error('Invalid testid: ' + testid);
  if (!testConfig) throw Error('Invalid settings: ' + testConfig);
  if (!testmethod) throw Error('Invalid testmethod: ' + testmethod);

  //Check Threshholds and provide fallback
  let hecThreshFl = testConfig.account.hecThreshFl || 0;
  let virusThreshFl = testConfig.account.virusThreshFl || 0;

  //split by linebreak
  let parsedResults = resultFile.split(/\r?\n/);

  //Parse rows for Amp Data
  const resultsRawDataStart = parsedResults.indexOf('Quan. AmpData') + 1;
  const resultsRawDataEnd = parsedResults.indexOf('Quan. Result');
  let resultsRawData = parsedResults
    .slice(resultsRawDataStart, resultsRawDataEnd)
    .filter((row) => row !== '' && row.substring(0, 4) != 'Well')
    .map((row) => row.split(','));

  //Validate File
  if (!resultsRawData) throw Error('Invalid Result File, no Raw Data found');

  let parsedResultsData = [];

  //Read Cycle Values
  resultsRawData.forEach((row) => {
    const position = row[0];
    const parameter = row[4].toUpperCase();
    const curveData = row.slice(5);
    const finalCycle = row.slice(5)[row.slice(5).length - 1];

    //Pass to result object
    if (!parsedResultsData[position]) {
      parsedResultsData[position] = {};
    }
    if (!parsedResultsData[position].parameters) {
      parsedResultsData[position].parameters = [];
    }
    if (!parsedResultsData[position].parameters[parameter]) {
      parsedResultsData[position].parameters[parameter] = {};
    }
    parsedResultsData[position].parameters[parameter].curveData = curveData;
    parsedResultsData[position].parameters[parameter].finalCycle = finalCycle;
    parsedResultsData[position].parameters[parameter].threshhold =
      testmethod.parameters.find((param) => param.target === parameter)?.threshhold || '';
  });

  //Parse Rows for Results
  const resultsDataStart = parsedResults.indexOf('Quan. Result') + 1;
  const resultsDataEnd =
    parsedResults.indexOf('SNP Result') === -1 ? parsedResults.length + 1 : parsedResults.indexOf('SNP Result');
  let resultsData = parsedResults
    .slice(resultsDataStart, resultsDataEnd)
    .filter(
      (row) =>
        row !== '' && row !== 'Well,Sample ID,Property,Target,Dye,Ct,Ct Mean,Ct SD,Concentration,Aver. Con.,Con. SD'
    )
    .map((row) => row.split(','));

  //Validate File
  if (!resultsData) throw Error('Invalid Result File, no results found');

  //Read Values
  resultsData.forEach((row, index) => {
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
    parsedResultsData[position].result = 'invalid';

    //Define functions to call upon evaluation
    const CT = (param) => {
      const ctValue = parsedResultsData[position].parameters[param]?.ct;
      return Number(ctValue);
    };

    const FL = (param) => {
      const flValue = parsedResultsData[position].parameters[param]?.finalCycle;
      return Number(flValue);
    };

    const Thresh = (param) => {
      const threshValue = parsedResultsData[position].parameters[param]?.threshhold;
      return Number(threshValue);
    };

    //parse result conditions
    testmethod.results.forEach((resultType) => {
      let conditions = resultType.conditions
        .replaceAll('(', '("')
        .replaceAll(')', '")')
        .replaceAll('hecThresh', 'hecThreshFl')
        .replaceAll('virusThresh', 'virusThreshFl')
        .replaceAll('=', '==')
        .replaceAll('\n', '')
        .split(',')
        .map((s) => '(' + s.trim() + ')')
        .join(' && ');
      const passed = eval(conditions);
      console.log(
        'position->' +
          parsedResultsData[position].label +
          '->evaluating: ' +
          conditions +
          ' = ' +
          passed +
          ' -> ' +
          resultType.name +
          "CT('VIC') -> " +
          CT('VIC'),
        "CT('FAM') -> " + CT('FAM'),
        "CT('ROX) ->" + CT('ROX')
      );
      if (passed) {
        parsedResultsData[position].result = resultType.name;
        parsedResultsData[position].oldResult = resultType.name;
      }
    });
    if (override && JSON.parse(override)[position]) {
      parsedResultsData[position].result = JSON.parse(override)[position];
      parsedResultsData[position].alteredResult = true;
    }
  });
  console.log(parsedResultsData);
  window.api.logEvents('parsedResultsData: ' + parsedResultsData, 'logInfos.txt');
  //return

  return parsedResultsData;
};

/**
 * Get the results from the result file to be displayed in the results table and the results chart or graph
 * @param {string} resultFile - The result file to parse
 * @param {string} testid - The testid of the test
 * @param {object} testConfig - The Config file of the test
 * @param {string} testmethod - Test id of the selected testmethod
 * @returns {object} - The parsed results
 */
export const parseResultsDisplay = (resultFile, testid, testConfig, testmethod, override) => {
  return parseResults(resultFile, testid, testConfig, testmethod, override);
};

/**
 * Parses the results from the result file and calculates the results
 * @param {string} resultFile - The result file to parse
 * @param {string} testid - The testid of the test
 * @param {string} testmethod - testmethod id of the selected testmethod
 * @returns {object} - The parsed results
 */
export const parseResultsExport = (resultFile, testid, testConfig, testmethod) => {
  window.api.logEvents(`parseResultsExport settings: ${testConfig}`, 'logInfos.txt');

  const parsedData = parseResults(resultFile, testid, testConfig, testmethod);

  //init export file
  let exportFile = '';

  if (testmethod.type === 'Absolute') {
    exportFile += 'Position;Barcode;CT;Result\n';

    //Read Data
    for (let position in parsedData) {
      let data = parsedData[position];

      for (let paramName in data.parameters) {
        let paramData = data.parameters[paramName];

        //Add result entry for each parameter
        exportFile += `${position};${data.barcode};${paramData.ct};${data.result}\n`;
        break;
      }
    }
  }

  if (testmethod.type === 'SNP') {
    exportFile += 'Position;Barcode;Result\n';

    //Read Data
    for (let position in parsedData) {
      let data = parsedData[position];
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
 * @param {string} testmethod - testmethod id of the selected testmethod
 * @param {object} testConfig - The Config file of the test
 * @param {Array} autoControls - Test id of the selected testmethod
 * @param {Date} testStarted - Date when the test was started
 * @param {string} userId - The id of the user who started the test
 **/
export const parseResultsDB = (
  testid,
  resultFile,
  testmethod,
  testConfig,
  autoControls = [],
  testStarted,
  userId = '',
  override
) => {
  const parsedData = parseResults(resultFile, testid, testConfig, testmethod, override);

  let results = ['Results'];
  let rawData = ['AmpData'];

  for (let position in parsedData) {
    let data = parsedData[position];

    //replace autoControl if present
    autoControls.forEach((autoControl) => {
      if (autoControl.position === position) {
        console.log(
          `replacing placeholder barcode"${data.barcode}" with "${autoControl.barcode}" on position "${position}"`
        );
        window.api.logEvents(
          `replacing placeholder barcode"${data.barcode}" with "${autoControl.barcode}" on position "${position}"`,
          'logInfos.txt'
        );
        data.barcode = autoControl.barcode;
      }
    });

    for (let paramName in data.parameters) {
      let paramData = data.parameters[paramName];
      console.log('paramData', paramData);
      //Add result entry for each parameter
      results.push({
        barcode: data.barcode,
        device: testConfig.device.hardwareId,
        run: testid,
        position,
        parameter: testmethod.parameters.find((param) => param.target === paramName)?.dbTransformation || paramName,
        ct: paramData.ct,
        testStarted,
        orderKey: testConfig.account.orderKey,
        threshhold: testmethod.parameters.find((param) => param.target === paramName)?.threshhold || '',
        hecThreshFl: testConfig.account.hecThreshFl,
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
          parameter: testmethod.parameters.find((param) => param.target === paramName)?.dbTransformation || paramName,
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
      hecThreshFl: testConfig.account.hecThreshFl,
      virusThreshFl: testConfig.account.virusThreshFl,
      userId,
      testmethod: testmethod.id,
      result: data.result,
      alteredResult: data.alteredResult,
      wellCount: testConfig.device.wellCount,
      specificationId: testmethod.specificationId,
      isControl: data.isControl,
    });
  }

  const dbSubmit = results.concat(rawData);
  return dbSubmit;
};
