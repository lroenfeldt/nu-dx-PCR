import { ITestObject } from "../../../electron/interfaces/interfaces";
import { IBarcode, IError } from "./interfaces";
import { IAccount, IDevice, IUserSettings, IAccountUser } from "./settings";

export interface ISettings {
  id: number;
  durationMinutes: number;
  account: IAccount;
  user: IUserSettings;
  isDev: boolean;
  version: string;
  device: IDevice;
  [key: string]: any;
}

export interface IDataProviderProps {
  children: JSX.Element;
}

enum Page {
  cards = "cards",
  table = "table",
}

export interface IUseData {
  info: boolean;
  setInfo: React.Dispatch<React.SetStateAction<boolean>>;

  page: keyof typeof Page;
  setPage: React.Dispatch<React.SetStateAction<keyof typeof Page>>;

  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;

  currentMenu: any;
  setCurrentMenu: React.Dispatch<React.SetStateAction<any>>;

  openResults: boolean;
  setOpenResults: React.Dispatch<React.SetStateAction<boolean>>;

  errors: IError[];
  setErrors: React.Dispatch<React.SetStateAction<IError[]>>;
  handleErrors: (payload: { type: string; message: string }[]) => void;

  demo: boolean;
  setDemo: React.Dispatch<React.SetStateAction<boolean>>;

  toggleDemo: () => void;

  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;

  resultList: any[];
  setResultList: React.Dispatch<React.SetStateAction<any[]>>;

  shutdown: () => void;
  reboot: () => void;
  exit: () => void;
  clearSettings: () => Promise<boolean>;
  saveSettings: (settings: any) => Promise<boolean>;
  toggleLid: () => void;

  barcodes: IBarcode[];
  setBarcodes: React.Dispatch<React.SetStateAction<IBarcode[]>>;

  remTime: number;
  setRemTime: React.Dispatch<React.SetStateAction<number>>;

  testrun: boolean;
  setTestrun: React.Dispatch<React.SetStateAction<boolean>>;

  testid: string;
  setTestid: React.Dispatch<React.SetStateAction<string>>;

  testDone: boolean;
  setTestDone: React.Dispatch<React.SetStateAction<boolean>>;

  pairingCode: string | null;
  setPairingCode: React.Dispatch<React.SetStateAction<string | null>>;

  resultsSubmitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;

  reset: () => void;
  resetBarcodes: () => void;
  loadSettings: () => Promise<ISettings>;

  setSubmitFilter: React.Dispatch<React.SetStateAction<boolean>>;
  submitFilter: boolean;

  updateAvailable: boolean;
  setUpdateAvailable: React.Dispatch<React.SetStateAction<boolean>>;

  currentUser: IAccountUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<IAccountUser>>;

  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  isModal: boolean;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;

  isNinetySix: boolean;
  setIsNinetySix: React.Dispatch<React.SetStateAction<boolean>>;

  paramTrans: { CY5: string; ROX: string };
  setParamTrans: React.Dispatch<
    React.SetStateAction<{ CY5: string; ROX: string }>
  >;

  handleSettingChange: (key: string, value: string) => Promise<void>;
  handleSettings: (newSettings: any) => void;

  isStatus: boolean;
  setIsStatus: React.Dispatch<React.SetStateAction<boolean>>;

  selectedMethod: string;
  setSelectedMethod: React.Dispatch<React.SetStateAction<string>>;

  deviceStatus: string;
  setDeviceStatus: React.Dispatch<React.SetStateAction<string>>;

  USBPresent: boolean;
  setUSBPresent: React.Dispatch<React.SetStateAction<boolean>>;

  results: ITestObject[];
  setResults: React.Dispatch<React.SetStateAction<ITestObject[]>>;

  reading: boolean;
  setReading: React.Dispatch<React.SetStateAction<boolean>>;

  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;

  viewResults: string;
  setViewResults: React.Dispatch<React.SetStateAction<string>>;

  dbConnection: boolean;
  setDbConnection: React.Dispatch<React.SetStateAction<boolean>>;

  offlineMode: boolean;
  setOfflineMode: React.Dispatch<React.SetStateAction<boolean>>;

  isLidOpen: boolean;
  setIsLidOpen: React.Dispatch<React.SetStateAction<boolean>>;

  selectedPosition: string;
  setSelectedPosition: React.Dispatch<React.SetStateAction<string>>;

  handleOpenEdit: (barcode: { posName: String }) => void;
  handleError: (type: string, message: string) => void;

  idleTimestamp: number | null;
  setIdleTimestamp: React.Dispatch<React.SetStateAction<number | null>>;

  checkForTestResultFile: boolean;
  setCheckForTestResultFile: React.Dispatch<React.SetStateAction<boolean>>;

  lotNumber: string | null;
  setLotNumber: React.Dispatch<React.SetStateAction<string | null>>;

  updateType: string;
  setUpdateType: React.Dispatch<React.SetStateAction<string>>;

  isResultFilePresent: boolean;
  setIsResultFilePresent: React.Dispatch<React.SetStateAction<boolean>>;

  failedSubmittingResults: string[];
  setFailedSubmittingResults: React.Dispatch<React.SetStateAction<string[]>>;

  viewType: string;
  setViewType: React.Dispatch<React.SetStateAction<string>>;

  controlMenu: boolean;
  setControlMenu: React.Dispatch<React.SetStateAction<boolean>>;

  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;

  resultSubmitted: boolean;
  setResultSubmitted: React.Dispatch<React.SetStateAction<boolean>>;

  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;

  selectedItem: JSX.Element;
  setSelectedItem: React.Dispatch<React.SetStateAction<JSX.Element>>;

  isSelected: boolean;
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
}
