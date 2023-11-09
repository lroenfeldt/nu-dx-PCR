import {
  IExtractedBarcodes,
  IParsedResult,
  TExtractBarcodes,
  TParseResults,
  TParseResultsDB,
  TParseResultsExport,
} from "../types/interfaces/parseResults";

/**
 * Extract Barcodes from given result file
 * @param {*} resultFile
 * @returns {Array} array of barcodes
 */

export const extractBarcodes: TExtractBarcodes = (resultFile) => {
  let extractedBarcodes: IExtractedBarcodes[] = [];
  let parsedResults = resultFile.split(/\r?\n/);

  //Parse Rows for Results
  const resultsDataStart = parsedResults.indexOf("Quan. Result") + 1;
  let resultsData = parsedResults
    .slice(resultsDataStart)
    .filter((row) => row !== "" && row.substring(0, 4) != "Well")
    .map((row) => row.split(","));
  //Validate File
  if (!resultsData) {
    throw Error("Invalid Result File, no Barcodes found");
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
export const parseResults: TParseResults = (
  resultFile,
  testid,
  testConfig,
  testmethod,
  override
) => {
  window.api.logEvents("parsing results");

  //Check provided Input
  if (!resultFile) throw Error("Invalid resultFile: " + resultFile);
  if (!testid) throw Error("Invalid testid: " + testid);
  if (!testConfig) throw Error("Invalid settings: " + testConfig);
  if (!testmethod) throw Error("Invalid testmethod: " + testmethod);
  //Check Threshholds and provide fallback(don´t delete these two variables, they will be used in eval functions)
  let hecThreshFl = testConfig.account.hecThreshFl || 0;
  let virusThreshFl = testConfig.account.virusThreshFl || 0;
  //split by linebreak
  let parsedResults = resultFile.split(/\r?\n/);

  //Parse rows for Amp Data
  const resultsRawDataStart = parsedResults.indexOf("Quan. AmpData") + 1;
  const resultsRawDataEnd = parsedResults.indexOf("Quan. Result");
  let resultsRawData = parsedResults
    .slice(resultsRawDataStart, resultsRawDataEnd)
    .filter((row) => row !== "" && row.substring(0, 4) != "Well")
    .map((row) => row.split(","));

  //Validate File
  if (!resultsRawData) throw Error("Invalid Result File, no Raw Data found");

  let parsedResultsData: Record<string, IParsedResult> = {};

  //Read Cycle Values
  resultsRawData.forEach((row) => {
    const position = row[0];
    const parameter = row[4].toUpperCase();
    const curveData = row.slice(5);
    const finalCycle = row.slice(5)[row.slice(5).length - 1];

    //Pass to result object
    if (!parsedResultsData[position]) {
      parsedResultsData[position] = {
        barcode: "",
        parameters: {},
        label: "",
        alteredResult: false,
        calculatedResult: "",
        isControl: false,
        result: "",
      };
    }
    if (!parsedResultsData[position].parameters) {
      parsedResultsData[position].parameters = {};
    }
    if (!parsedResultsData[position].parameters[parameter]) {
      parsedResultsData[position].parameters[parameter] = {
        parameter: parameter,
        ct: "",
        curveData: [],
        result: "",
        orginalResult: "",
        expectedResult: "",
        finalCycle: "",
        threshhold: 0,
        target: "",
      };
    }
    parsedResultsData[position].parameters[parameter].curveData = curveData;
    parsedResultsData[position].parameters[parameter].finalCycle = finalCycle;
    parsedResultsData[position].parameters[parameter].threshhold =
      testmethod.parameters.find((param) => param.target === parameter)
        ?.threshhold || 0;
  });

  //Parse Rows for Results
  const resultsDataStart = parsedResults.indexOf("Quan. Result") + 1;
  const resultsDataEnd =
    parsedResults.indexOf("SNP Result") === -1
      ? parsedResults.length + 1
      : parsedResults.indexOf("SNP Result");
  let resultsData = parsedResults
    .slice(resultsDataStart, resultsDataEnd)
    .filter(
      (row) =>
        row !== "" &&
        row !==
          "Well,Sample ID,Property,Target,Dye,Ct,Ct Mean,Ct SD,Concentration,Aver. Con.,Con. SD"
    )
    .map((row) => row.split(","));

  //Validate File
  if (!resultsData) throw Error("Invalid Result File, no results found");

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
    parsedResultsData[position].calculatedResult = "";
    parsedResultsData[position].isControl = false;
    //Set labels for Controls
    if (
      [
        "Placeholder_NTC",
        "SC2NTC",
        "NTC",
        "Placeholder_TPC",
        "SC2TPC",
        "TPC",
      ].includes(barcode) ||
      barcode.slice(0, 3) == "TPC" ||
      barcode.slice(0, 3) == "NTC"
    ) {
      parsedResultsData[position].isControl = true;
    }
    if (["Placeholder_NTC", "SC2NTC", "NTC"].includes(barcode)) {
      parsedResultsData[position].label = "NTC";
    }
    if (["Placeholder_TPC", "SC2TPC", "TPC"].includes(barcode)) {
      parsedResultsData[position].label = "TPC";
    }
    if (["TPC1", "TPC2"].includes(barcode)) {
      parsedResultsData[position].label = barcode;
    }
  });

  //CALCULATE RESULTS
  Object.keys(parsedResultsData).forEach((position) => {
    //Set default result to invalid
    parsedResultsData[position].result = "invalid";
    parsedResultsData[position].calculatedResult = "invalid";

    //Define functions to call upon evaluation
    function CT(param: string) {
      const ctValue = parsedResultsData[position].parameters[param]?.ct;
      return Number(ctValue);
    }

    function FL(param: string) {
      const flValue = parsedResultsData[position].parameters[param]?.finalCycle;
      return Number(flValue);
    }

    function Thresh(param: string) {
      const threshValue =
        parsedResultsData[position].parameters[param]?.threshhold;
      return Number(threshValue);
    }

    //parse result conditions
    testmethod.results.forEach((resultType) => {
      const conditions = resultType.conditions
        .replaceAll('(FAM)', '("FAM")')
        .replaceAll('(HEX)', '("HEX")')
        .replaceAll('(VIC)', '("VIC")')
        .replaceAll('(ROX)', '("ROX")')
        .replaceAll('(CY5)', '("CY5")')
        .replaceAll('(CY5.5)', '("CY5.5")')
        .replaceAll("hecThresh", "hecThreshFl")
        .replaceAll("virusThresh", "virusThreshFl")
        .replaceAll("=", "==")
        .replaceAll("\n", "")
        .split(",")
        .map((s) => "(" + s.trim() + ")")
        .join(" && ");

      //Vite does not consider declared and unused functions during compilation, hence the need to write this line to prevent the functions from being ignored.
      CT("ROX") > 0 &&
        CT("ROX") < 40 &&
        (CT("FAM") == 0 || FL("FAM") > 40) &&
        (Thresh("VIC") == 0 || CT("VIC") > 40);

      const passed = eval(conditions);

      if (passed) {
        parsedResultsData[position].result = resultType.name;
        parsedResultsData[position].calculatedResult = resultType.name;
      }
    });

    //Translate NTC Results
    if (
      parsedResultsData[position].label === "NTC" &&
      parsedResultsData[position].result === "invalid"
    ) {
      parsedResultsData[position].result = "negative";
    } else if (
      parsedResultsData[position].label === "NTC" &&
      parsedResultsData[position].result === "negative"
    ) {
      parsedResultsData[position].result = "invalid";
    }

    //Apply Overrides

    if (override && JSON.parse(override)[position]) {
      console.log("override", JSON.parse(override)[position]);
      parsedResultsData[position].result = JSON.parse(override)[position];
      parsedResultsData[position].alteredResult = true;
    }
  });

  return parsedResultsData;
};

/**
 * Parses the results from the result file and calculates the results
 * @param {string} resultFile - The result file to parse
 * @param {string} testid - The testid of the test
 * @param {string} testmethod - testmethod id of the selected testmethod
 * @returns {object} - The parsed results
 */
export const parseResultsExport: TParseResultsExport = (
  resultFile,
  testid,
  testConfig,
  testmethod,
  lotNumber = ""
) => {
  window.api.logEvents(`parseResultsExport settings: ${testConfig}`);

  const parsedData = parseResults(resultFile, testid, testConfig, testmethod);

  //init export file
  let exportFile = "";

  if (testmethod.type === "Absolute") {
    exportFile += "Position;Barcode;CT;Result;lotNumber\n";

    //Read Data
    for (let position in parsedData) {
      let data = parsedData[position];

      for (let paramName in data.parameters) {
        let paramData = data.parameters[paramName];

        //Add result entry for each parameter
        exportFile += `${position};${data.barcode};${paramData.ct};${data.result};${lotNumber}\n`;
        break;
      }
    }
  }

  if (testmethod.type === "SNP") {
    exportFile += "Position;Barcode;Result;lotNumbe\n";

    //Read Data
    for (let position in parsedData) {
      let data = parsedData[position];
      exportFile += `${position};${data.barcode};${data.result};${lotNumber}\n`;
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
export const parseResultsDB: TParseResultsDB = (
  testid,
  resultFile,
  testmethod,
  testConfig,
  autoControls = [],
  testStarted,
  userId = "",
  override,
  lotNumber = ""
) => {
  const parsedData = parseResults(
    resultFile,
    testid,
    testConfig,
    testmethod,
    override
  );

  const runData = {
    run: testid,
    testmethod: testmethod.id,
    specificationId: testmethod.specificationId,
    device: testConfig.device.hardwareId,
    wellCount: testConfig.device.wellCount,
    customerId: testConfig.account.orderKey,
    userId,
    testStarted,
  };

  const samples = Object.entries(parsedData).map(([position, data]) => {
    const {
      barcode,
      parameters,
      isControl,
      result,
      calculatedResult,
    } = data;

    const expectedResult = testmethod.controlSamples
      .find(({position16, position96}) => 
        testConfig.device.wellCount == 16 && position16 == position 
        || testConfig.device.wellCount == 96 && position96 == position)
        ?.expectedResult || ""
    
    const sampleParameters = Object.entries(parameters).map(
      ([paramName, { ct, curveData }]) => {
        const { dbTransformation, threshhold } =
          testmethod.parameters.find(({ target }) => target === paramName) ||
          {};
        return {
          parameter: paramName, //dbTransformation not needed for new database anymore
          ct,
          curveData: curveData.map((value) => parseFloat(value).toFixed(3)),
          threshhold: threshhold || 0,
        };
      }
    );

    return {
      position,
      controlType: isControl || false, // TPC, NTC or whatever, fetch from account-> testmethod (dynamic controls feature)
      barcode,
      pcrLOT: lotNumber || "",
      pureLOT: "", //coming soon (from auth screen as well probably)
      parameters: sampleParameters,
      resultParameter: testmethod.resultParameter || "RESULT",
      result,
      originalResult : calculatedResult || "",
      expectedResult, //expected result for control samples as defined in nu:dx cloud. If no controll then empty
    };
  });

  return {
    runData,
    samples,
  };
};
