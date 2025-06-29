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
  window.api.logEvents('parsing results', 'logInfos.txt');

  //Check provided Input
  if (!resultFile) throw Error('Invalid resultFile: ' + resultFile);
  if (!testid) throw Error('Invalid testid: ' + testid);
  if (!testConfig) throw Error('Invalid settings: ' + testConfig);
  if (!testmethod) throw Error('Invalid testmethod: ' + testmethod);

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
    if (
      ['Placeholder_NTC', 'SC2NTC', 'NTC', 'Placeholder_TPC', 'SC2TPC', 'TPC'].includes(barcode) ||
      barcode.slice(0, 3) == 'TPC' ||
      barcode.slice(0, 3) == 'NTC'
    ) {
      parsedResultsData[position].isControl = true;
    }
    if (['Placeholder_NTC', 'SC2NTC', 'NTC'].includes(barcode)) {
      parsedResultsData[position].label = 'NTC';
    }
    if (['Placeholder_TPC', 'SC2TPC', 'TPC'].includes(barcode)) {
      parsedResultsData[position].label = 'TPC';
    }
    if (['TPC1', 'TPC2'].includes(barcode)) {
      parsedResultsData[position].label = barcode;
    }
  });

  //CALCULATE RESULTS
  Object.keys(parsedResultsData).forEach((position) => {
    //Set default result to invalid
    parsedResultsData[position].result = 'invalid';

    //Define functions to call upon evaluation
    function CT(param) {
      const ctValue = parsedResultsData[position].parameters[param]?.ct;
      return Number(ctValue);
    }

    function FL(param) {
      const flValue = parsedResultsData[position].parameters[param]?.finalCycle;
      return Number(flValue);
    }

    function Thresh(param) {
      const threshValue = parsedResultsData[position].parameters[param]?.threshhold;
      return Number(threshValue);
    }

    //parse result conditions
    testmethod.results.forEach((resultType) => {
      let conditions = resultType.conditions
        .replaceAll('(FAM)', '("FAM")')
        .replaceAll('(HEX)', '("HEX")')
        .replaceAll('(VIC)', '("VIC")')
        .replaceAll('(ROX)', '("ROX")')
        .replaceAll('(CY5)', '("CY5")')
        .replaceAll('(CY5.5)', '("CY5.5")')
        .replaceAll('hecThresh', 'hecThreshFl')
        .replaceAll('virusThresh', 'virusThreshFl')
        .replaceAll('=', '==')
        .replaceAll('\n', '')
        .split(',')
        .map((s) => '(' + s.trim() + ')')
        .join(' && ');

      //Vite does not consider declared and unused functions during compilation, hence the need to write this line to prevent the functions from being ignored.
      CT('ROX') > 0 && CT('ROX') < 40 && (CT('FAM') == 0 || FL('FAM') > 40) && (Thresh('VIC') == 0 || CT('VIC') > 40);

      const passed = eval(conditions);

      if (passed) {
        parsedResultsData[position].result = resultType.name;
        parsedResultsData[position].oldResult = resultType.name;
      }
    });

    //Translate NTC Results
    if (parsedResultsData[position].label === 'NTC' && parsedResultsData[position].result === 'invalid') {
      parsedResultsData[position].result = 'negative';
    } else if (parsedResultsData[position].label === 'NTC' && parsedResultsData[position].result === 'negative') {
      parsedResultsData[position].result = 'invalid';
    }

    //Apply Overrides
    if (override && JSON.parse(override)[position]) {
      parsedResultsData[position].result = JSON.parse(override)[position];
      parsedResultsData[position].alteredResult = true;
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
export const parseResultsExport = (resultFile, testid, testConfig, testmethod, lotNumber = '') => {
  window.api.logEvents(`parseResultsExport settings: ${testConfig}`, 'logInfos.txt');

  const parsedData = parseResults(resultFile, testid, testConfig, testmethod);

  // Initialize export file
  let exportFile = '';

  if (testmethod.type === 'Absolute') {
    // Column headers
    const ctHeaders = testmethod.parameters
      .filter((parameter) => parameter.showCT)
      .map((parameter) => 'CT-' + parameter.label)
      .join(';');

    const flHeaders = testmethod.parameters
      .filter((parameter) => parameter.showFL)
      .map((parameter) => 'FL-' + parameter.label)
      .join(';');

    exportFile += `Position;Barcode;CT;Result;lotNumber;${ctHeaders};${flHeaders}\n`;

    // Read Data
    for (let position in parsedData) {
      let data = parsedData[position];

      const ctColumns = testmethod.parameters
        .map((parameter) => {
          if (parameter.showCT) {
            return data.parameters[parameter.target]?.ct || data.parameters[parameter.target.toLowerCase()]?.ct || '-';
          }
          return null;
        })
        .filter((value) => value)
        .join(';');

      const flColumns = testmethod.parameters
        .map((parameter) => {
          if (parameter.showFL) {
            const flValue =
              data.parameters[parameter.target]?.finalCycle ||
              data.parameters[parameter.target.toLowerCase()]?.finalCycle;
            return flValue !== undefined ? parseInt(flValue) : '-';
          }
          return null;
        })
        .filter((value) => value)
        .join(';');

      exportFile += `${position};${data.barcode};${data.parameters?.ct};${data.result};${lotNumber};${ctColumns};${flColumns}\n`;
    }
  }

  if (testmethod.type === 'SNP') {
    exportFile += 'Position;Barcode;Result\n';

    // Read Data
    for (let position in parsedData) {
      let data = parsedData[position];
      exportFile += `${position};${data.barcode};${data.result}\n`;
    }
  }

  // Return the constructed export file content
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
  testStarted,
  userId = '',
  override,
  lotNumber = '',
  token = null
) => {
  const parsedData = parseResults(resultFile, testid, testConfig, testmethod, override);

  const resultData = {
    runData: {
      run: testid,
      testmethod: testmethod.id,
      device: testConfig.device.hardwareId,
      wellcount: testConfig.device.wellCount || 16,
      customerId: testConfig.account.data.id,
      userId,
      testStarted,
    },
    samples: [],
    token: token,
  };

  for (let position in parsedData) {
    const sampleData = {
      position,
      controlType: parsedData[position].isControl || false,
      barcode: parsedData[position].barcode,
      label: parsedData[position].label || '',
      pcrLOT: lotNumber || '',
      pureLOT: '',
      originalResult: parsedData[position].oldResult || '',
      expectedResult: null, //need to be set later
      result: parsedData[position].result || '',
      parameters: [],
    };

    let data = parsedData[position];

    for (let paramName in data.parameters) {
      let paramData = data.parameters[paramName];

      sampleData.parameters.push({
        parameter: paramName,
        ct: paramData.ct || '',
        curveData: paramData.curveData || [],
        threshhold: testmethod.parameters.find((param) => param.target === paramName)?.threshhold || '',
      });
    }

    resultData.samples.push(sampleData);
  }

  console.log('submitData:', resultData);

  return resultData;
};
