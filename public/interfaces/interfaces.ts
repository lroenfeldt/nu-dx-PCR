export interface ISoftwareList {
  path:
    | 'C:\\Bioer\\LineGene\\1600\\bin\\LineGene1600.exe'
    | 'C:\\Bioer\\LineGene1600 for research\\1644\\bin\\LineGene1600.exe'
    | 'C:\\BIOER\\LineGene1600 for research\\1640\\bin\\LineGene1600.exe'
    | 'C:\\BIOER\\96\\bin\\Gene-9660.exe';
  returnType: '16' | '96';
  name: 'LineGene1600' | 'LineGene1644' | 'LineGene1640' | 'LineGene9600';
}

export interface IStore {
  get: <T>(key: string) => T | any;
  clear: () => void;
  set: <T>(key: string, value: T) => void;
  // In this updated version, the `get` method takes in a generic type parameter `T`,
  // which allows TypeScript to infer the return type based on the key used to access the value.
  // The `set` method also takes in a generic type parameter `T` to specify the type of the value being set.
  defaults: {
    settings: {
      account: IAccount;
      user: IUser;
    };
  };
}

export interface IAccount {
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
    role: {
      name: string;
      isAdmin: boolean;
    };
  };
}

export interface IUser {
  tpcPos: string;
  ntcPos: string;
  locale: string;
  updateType: string;
}

export interface IFile {
  isDirectory: () => boolean;
  // In ElectronJS and Node.js, the `isDirectory()` method is typically defined as a function
  // that returns a boolean value indicating whether the file represented by the `File` object is a directory
  // With this type definition, TypeScript can now infer that the `isDirectory` method returns a boolean value,
  // which can be used for type checking and to provide IntelliSense suggestions when working with `File` objects.
  name: string;
}

export interface ISettings {
  account: {
    authToken?: string;
  };
  barcodes: IBarcode[];
  testid: string;
  testmethod: Object;
}

export interface IBarcode {
  id: number | string; // check later
  posName: string;
  label: string;
  value: string;
  checking: false;
  valid: boolean;
  error: Error;
  blocked: boolean; // check later
}

export interface IDevice {
  hardwareId: string;
  deviceType: string;
  serialNumber: string;
}

export interface IProgressObj {
  percent: number;
}
