import { IBarcode } from "./interfaces";
import { TCurveData } from "./parseResults";

export interface ISettings {
  account: IAccount;
  user: IUserSettings;
  isDev: boolean;
  version: string;
  device: IDevice;
}

export interface IConfigFile {
  account: IAccount;
  user: IUserSettings;
  isDev: boolean;
  version: string;
  device: IDevice;
  barcodes: IBarcode[];
  testid: string;
  testmethod?: string;
}
export interface IAccount {
  data: IAccountData;
  users: IAccountUser[];
  serialNumber: string;
  testprocedures: ITestProcedure[];
  maxBarcodeLength: number;
  minBarcodeLength: number;
  allowedCharacters: string;
  orderKey: string;
  checkOrder: boolean;
  autoSubmitUnsubmitted: boolean;
  autoControl: boolean;
  checkBarcodesDB: boolean;
  submitRunSetup: boolean;
  showResults: boolean;
  submitResults: boolean;
  customCheckBarcodesEndpoint: string;
  customSubmitRunSetupEndpoint: string;
  customSubmitAutoControlEndpoint: string;
  customFetchAutoControlEndpoint: string;
  customSubmitResultsEndpoint: string;
  hecThreshFl: number;
  virusThreshFl: number;
  showCurves: boolean;
  allowRetest: boolean;
  allowOffline: boolean;
  hasUserAuthentification: boolean;
  autoSubmitResults: boolean;
  allowDaysOffline: number;
  additionalAttributes: IAdditionalAttribute[];
  changeResults: boolean;
  autoControlSamples: string;
  autoShutdownMinutes: number;
  autoCloseLidMinutes: number;
  showPatientData: boolean;
  barcodeShowPatientData: boolean;
  barcodeCheckPatientData: boolean;
  askForLot: boolean;
  orderLabelWidthMM: number | null;
  orderLabelHeightMM: number | null;
  authToken: string;
  initialized: boolean;
  preregisterControlSamples: boolean;
  verifyBarcodes: boolean;
}

export interface IAccountData {
  id: string;
  name: string;
  email: string;
  address: string;
}

export interface IAccountUser {
  id: string;
  name: string;
  email: string;
  isCertified: boolean;
  certifiedTestprocedureIds: string[];
}

export interface ITestProcedure {
  id: string;
  name: string;
  type: string;
  labelEN: string;
  labelFR: string;
  labelDE: string;
  protocol: string;
  translate: string;
  showCurves: boolean;
  organization: string;
  showResults: boolean;
  results: ITestResult[];
  durationMinutes: number;
  resultParameter: string;
  specificationId: string;
  additionalAttributes: any[];
  parameters: ITestParameter[];
  parameter: ITestParameterMapping;
}

export interface ITestParameterMapping {
  CY5: string;
  ROX: string;
}

export interface ITestParameter {
  id: string;
  label: string;
  color: string;
  target: string;
  showCT: boolean;
  showFL: boolean;
  isPrimary: boolean;
  threshhold: number;
  showThreshhold: boolean;
  dbTransformation: string;
  ctWarningMin: null | number;
  ctWarningMax: null | number;
  curveData: TCurveData;
}

export interface ITestResult {
  id: string;
  name: string;
  color: string;
  labelEN: string;
  labelFR: string;
  labelDE: string;
  tooltipDE: string;
  tooltipEN: string;
  tooltipFR: string;
  conditions: string;
  test_type_id: string;
  countInStatistic: boolean;
  submitted?: boolean;
  testid?: string | undefined;
  [key: string]: any;
}

export interface IAdditionalAttribute {
  id: number;
  key: string;
  value: string;
}

export interface IDevice {
  hardwareId: string;
  wellCount: number;
  serialNumber: string;
}

export interface IUserSettings {
  tpcPos: string;
  ntcPos: string;
  locale: string;
  updateType: string;
}
