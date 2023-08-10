export interface Settings {
  id: number;
  durationMinutes: number;
  account: Account;
  user: User;
  isDev: boolean;
  version: string;
  device: Device;
  [key: string]: any;
}

export interface Account {
  data: Data;
  users: UserElement[];
  serialNumber: null;
  testprocedures: Testprocedure[];
  maxBarcodeLength: string;
  minBarcodeLength: string;
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
  additionalAttributes: AdditionalAttribute[];
  changeResults: boolean;
  autoControlSamples: string;
  autoShutdownMinutes: number;
  autoCloseLidMinutes: number;
  showPatientData: boolean;
  barcodeShowPatientData: boolean;
  barcodeCheckPatientData: boolean;
  askForLot: boolean;
  orderLabelWidthMM: null;
  orderLabelHeightMM: null;
  disableControlSampleSubmit: boolean;
  disableBarcodeCheck: boolean;
  verifyBarcodes: boolean;
  preregisterControlSamples: boolean;
  authToken: string;
  initialized: boolean;
}

export interface AdditionalAttribute {
  id: number;
  key: string;
  value: string;
}

export interface Data {
  config?: {};
  id: string;
  name: string;
  email: string;
  address: string;
}

export interface Testprocedure {
  [key: string]:
    | string
    | number
    | null
    | boolean
    | Type
    | ParameterParameter
    | ParameterElement[]
    | Result[]
    | null[]
    | string[]
    | Function
    | undefined;
  id: string;
  name: string;
  translate: string;
  protocol: string;
  durationMinutes: number | null;
  additionalAttributes: any[];
  type: Type | null | '';
  parameter: ParameterParameter | null | string;
  parameters: ParameterElement[] | null;
  resultParameter: null | string;
  labelEN: string;
  labelFR: string;
  labelDE: string;
  results: Result[];
  specificationId: null | string;
  organization: string;
  showCurves: boolean;
  showResults: boolean;
  status: any;
  setRemTime: Function | undefined;
  setErrors: Function | undefined;
}

export interface ParameterParameter {
  CY5?: string;
  ROX?: string;
  FAM?: string;
  HEX?: string;
}

export interface ParameterElement {
  id: string;
  target: Target | string;
  label: string;
  color: string;
  dbTransformation: string;
  isPrimary: boolean;
  showCT: boolean;
  showFL: boolean;
  threshhold: string;
  showThreshhold: boolean | null;
  ctWarningMin: number | null;
  ctWarningMax: number | null;
  curveData: string[];
  ct: string;
  [key: string]: any;
}

export enum Target {
  Cy5 = 'CY5',
  Fam = 'FAM',
  Hex = 'HEX',
  Rox = 'ROX',
  Vic = 'VIC',
}

export interface Result {
  [key: string]: any;
  id: number | string;
  name: string;
  conditions: string;
  color: Color | string;
  labelEN: null | string;
  labelFR: null | string;
  labelDE: null | string;
  test_type_id: string;
  tooltipDE: TooltipDE | null;
  tooltipEN: TooltipEN | null;
  tooltipFR: TooltipFR | null;
  countInStatistic: boolean | null;
  submittingSuccess: boolean | null;
  isWriting: boolean | null;
  testid: string;
  resultType: { conditions: string; name: string };
}

export enum Color {
  Ca8A04 = '#ca8a04',
  Dc2626 = '#dc2626',
  The16A34A = '#16a34a',
  The1B134F = '#1B134F',
}

export enum TooltipDE {
  Empty = '',
  Negativ = 'negativ',
  Positiv = 'positiv',
}

export enum TooltipEN {
  Empty = '',
  Negative = 'negative',
  Positive = 'positive',
}

export enum TooltipFR {
  Empty = '',
  Négatif = 'négatif',
  Positif = 'positif',
}

export enum Type {
  Absolute = 'Absolute',
  Relative = 'Relative',
  Snp = 'SNP',
}

export interface UserElement {
  isCertified: boolean;
  id: string;
  name: string;
  email: string;
  certifiedTestprocedureIds: string[];
}

export interface Device {
  hardwareId: string;
  wellCount: number;
  serialNumber: string;
}

export interface User {
  email: string;
  name: string;
  id: string;
  locale: string;
  updateType: string;
  tpcPos: string;
  ntcPos: string;
}
