export interface IStore {
  settings: Settings;
}
export interface Role {
  name: string;
  isAdmin: boolean;
}
export interface Settings {
  account: AccountSettings;
  user: UserSettings;
  isDev?: boolean;
  device?: IDevice;
  version?: string;
}

export interface AccountSettings {
  initialized: boolean;
  authToken: string;
  maxBarcodeLength: number;
  minBarcodeLength: number;
  allowedCharacters: string;
  orderKey: string;
  autoControl: boolean;
  hecThreshFL: number;
  virusThreshFL: number;
  checkBarcodesDB: boolean;
  checkOrder: boolean;
  submitRunSetup: boolean;
  showResults: boolean;
  submitResults: boolean;
  autoSubmitUnsubmitted: boolean;
  customCheckBarcodesEndpoint: string;
  customSubmitRunSetupEndpoint: string;
  customSubmitAutoControlEndpoint: string;
  customFetchAutoControlEndpoint: string;
  customSubmitResultsEndpoint: string;
  data: {
    id: string;
    profileId: string;
    name: string;
    email: string;
    lastSignIn: string;
    authenticated: boolean;
    contactPerson: string;
    address: string;
    emailConfirmedAt: string;
    role: Role;
  };
  controlSamples: IControlSample[];
}
export interface IControlSample {
  id: string;
  name: string;
  label: string;
  expectedResult: string;
  position16: string;
  position96: string;
  barcodes: IBarcode[];
  testTypeId: string;
  order: number;
}

export interface UserSettings {
  tpcPos: string;
  ntcPos: string;
  locale: string;
  updateType: string;
}

export interface IBarcode {
  id: number;
  posName: string;
  label: string;
  value: string;
  checking: false;
  valid: boolean;
  error: Error;
  blocked: boolean;
}

export interface IDevice {
  hardwareId: string;
  deviceType?: string;
  serialNumber: string;
  wellCount: number;
}

export interface IGetResultResponse {
  resultFile: string;
  configFile: string;
  testStarted: number | Date;
  override: string | false;
}

export interface ILineGeneSettings {
  account: {
    authToken?: string;
  };
  barcodes?: string[];
  testid?: string;
  testmethod?: string;
}

export interface ITestObject {
  testid: string;
  testStarted: Date | string;
  testStartedMS: number;
  testFinished: Date;
  testFinishedMS: number;
  resultDirectory: string;
  submitted: boolean;
  testmethod: string | null;
  isSubmitting?: boolean;
  writingSuccess?: boolean;
  isWriting?: boolean;
  submittingSuccess?: boolean;
}
