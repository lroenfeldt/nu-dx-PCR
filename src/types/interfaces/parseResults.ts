import { IConfigFile, ITestProcedure } from "./settings";

export interface IParameter {
  parameter: string;
  ct: string;
  curveData: TCurveData;
  result: string;
  orginalResult: string;
  expectedResult: string;
  finalCycle: any;
  threshhold: number;
  target: string;
  [key: string]: any;
}

export interface IParsedResult {
  barcode: string;
  label?: string;
  alteredResult?: boolean;
  oldResult?: string;
  isControl?: boolean;
  parameters: Record<string, IParameter>;
  result?: string;
  position?: string | number;
}

export interface ITestConfigAccount {
  hecThreshFl?: number;
  virusThreshFl?: number;
}

export interface ITestConfig {
  account: ITestConfigAccount;
  device: {
    hardwareId: string;
    wellCount: number;
  };
}

export interface ITestMethodParameter {
  target: string;
  threshhold?: string;
  dbTransformation?: string;
  isPrimary?: boolean;
}

export interface ITestMethodResult {
  conditions: string;
  name: string;
  color: string;
}

export interface ITestMethod {
  id: string;
  specificationId: string;
  type: string;
  results: ITestMethodResult[];
  parameters: ITestMethodParameter[];
  protocol?: string;
}

export interface IAutoControl {
  type: string;
  run: string;
  order: string;
  barcode?: string;
  device: string;
  position?: string;
}

export interface IRunData {
  run: string;
  testmethod: string;
  specificationId: string;
  device: string;
  wellCount: number;
  orderKey: string;
  userId: string;
  testStarted: Date | string;
}

export interface ISampleParameter {
  parameter: string;
  ct: string;
  curveData: TCurveData;
  threshhold: number;
  result: string;
  orginalResult: string;
  expectedResult: string;
}

export interface ISample {
  position: string;
  controlType: boolean;
  barcode: string;
  pcrLOT: string;
  pureLOT: string;
  parameters: ISampleParameter[];
}

export interface IResultsDB {
  runData: IRunData;
  samples: ISample[];
}

export interface IExtractedBarcodes {
  value: string;
  position: string;
}

/******************************** TYPES ************************************/

// Type definitions
export type TExtractBarcodes = (resultFile: string) => IExtractedBarcodes[];
export type TCurveData = Array<string>;

export type TParseResults = (
  resultFile: string,
  testid: string,
  testConfig: IConfigFile,
  testmethod: ITestProcedure,
  override?: string
) => Record<string, IParsedResult>;

export type TParseResultsExport = (
  resultFile: string,
  testid: string,
  testConfig: IConfigFile,
  testmethod: ITestProcedure,
  lotNumber: string | null
) => string;

export type TParseResultsDB = (
  testid: string,
  resultFile: string,
  testmethod: ITestProcedure,
  testConfig: IConfigFile,
  autoControls: IAutoControl[],
  testStarted: Date | string,
  userId?: string,
  override?: string,
  lotNumber?: string
) => IResultsDB;
