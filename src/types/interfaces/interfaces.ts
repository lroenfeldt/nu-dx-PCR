import { IBarcode } from './../../../public/interfaces/interfaces';
export interface IPairingCode {
  hardwareId: string;
  pairingCode: number | string;
}

export interface IActiveBarcode {
  alteredResult: boolean;
  result: string;
}

export interface ITestMethod {
  results: { name: string; color: string }[];
}

export interface IAlteredResultProps {
  activeBarcode: IActiveBarcode | null;
  testmethod: ITestMethod;
  style?: any;
}

export interface ISettings {
  user: { updateType: string; ntcPos: string };
  device: { wellCount: any };
  account: any;
}

export interface IUseData {
  openResults: boolean;
  setOpenResults: (openResults: boolean) => void;
  errors: { type: string; message: string }[];
  handleErrors: (payload: { type: string; message: string }[]) => void;
  demo: boolean;
  toggleDemo: () => void;
  settings: ISettings;
  resultList: any[];
  shutdown: () => void;
  reboot: () => void;
  exit: () => void;
  clearSettings: () => Promise<boolean>;
  saveSettings: (settings: any) => Promise<boolean>;
  toggleLid: () => void;
  setErrors: (errors: { type: string; message: string }[]) => void;
  setDemo: (demo: boolean) => void;
  setSettings: (settings: ISettings) => void;
  setResultList: (resultList: any[]) => void;
  barcodes: IBarcode[];
  setBarcodes: (barcodes: any) => void;
  remTime: number;
  setRemTime: (remTime: number) => void;
  testrun: boolean;
  setTestrun: (testrun: boolean) => void;
  testid: string | null;
  setTestid: (testid: string | null) => void;
  testDone: boolean;
  setTestDone: (testDone: boolean) => void;
  pairingCode: string | null;
  setPairingCode: (pairingCode: string | null) => void;
  resultsSubmitted: boolean;
  setSubmitted: (resultsSubmitted: boolean) => void;
  reset: () => void;
  resetBarcodes: () => void;
  loadSettings: () => Promise<ISettings>;
  setSubmitFilter: (submitFilter: boolean) => void;
  submitFilter: boolean;
  updateAvailable: boolean;
  setUpdateAvailable: (updateAvailable: boolean) => void;
  currentUser: any; // TODO: replace with correct type(IUser)
  setCurrentUser: (currentUser: any) => void;
  menuOpen: number | null;
  setMenuOpen: (menuOpen: number | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isModal: boolean;
  setIsModal: (isModal: boolean) => void;
  isNinetySix: boolean;
  setIsNinetySix: (isNinetySix: boolean) => void;
  paramTrans: { CY5: string; ROX: string };
  setParamTrans: (paramTrans: { CY5: string; ROX: string }) => void;
  handleSettingChange: (key: string, value: string) => Promise<void>;
  handleSettings: (newSettings: any) => void;
  isStatus: boolean;
  setIsStatus: (isStatus: boolean) => void;
  selectedMethod: any; // TODO: replace with correct type(ISelectedMethod)
  setSelectedMethod: (selectedMethod: any) => void;
  deviceStatus: string;
  setDeviceStatus: (deviceStatus: string) => void;
  USBPresent: boolean;
  setUSBPresent: (USBPresent: boolean) => void;
  results: any[]; // TODO: replace with correct type(IResults)
  setResults: (results: any[]) => void;
  reading: boolean;
  setReading: (reading: boolean) => void;
  submitting: boolean;
  setSubmitting: (submitting: boolean) => void;
  viewResults: string;
  setViewResults: (viewResults: string) => void;
  dbConnection: boolean;
  setDbConnection: (dbConnection: boolean) => void;
  offlineMode: boolean;
  setOfflineMode: (offlineMode: boolean) => void;
  isLidOpen: boolean;
  setIsLidOpen: (isLidOpen: boolean) => void;
  selectedPosition: string | null;
  setSelectedPosition: (selectedPosition: string | null) => void;
  handleOpenEdit: (barcode: { posName: String }) => void;
  handleError: (type: string, message: string) => void;
  idleTimestamp: string | null;
  setIdleTimestamp: (idleTimestamp: string | null) => void;
  checkForTestResultFile: boolean;
  setCheckForTestResultFile: (checkForTestResultFile: boolean) => void;
  lotNumber: string | null;
  setLotNumber: (lotNumber: string | null) => void;
  updateType: string;
  setUpdateType: (updateType: string) => void;
}
