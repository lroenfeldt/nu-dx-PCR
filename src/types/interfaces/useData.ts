import { IBarcode } from './interfaces';
import { Account, Device, Result, User } from './settings';

export interface ISettings {
  id: number;
  durationMinutes: number;
  account: Account;
  user: User;
  isDev: boolean;
  version: string;
  device: Device;
  [key: string]: any;
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
  setErrors: (arg: Object | { errors: { type: string; message: string }[] }) => void;
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
  currentUser: User;
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
  selectedMethod: Object;
  setSelectedMethod: (selectedMethod: Object) => void;
  deviceStatus: string;
  setDeviceStatus: (deviceStatus: string) => void;
  USBPresent: boolean;
  setUSBPresent: (USBPresent: boolean) => void;
  results: Result;
  setResults: (
    results:
      | {
          (prevUnsubmittedResults: { isSubmitting: boolean; testid: string }[]): {
            isSubmitting: boolean;
            testid: string;
          }[];
        }
      | {
          (prevUnsubmittedResults: { writingSuccess: boolean; testid: string }[]): {
            writingSuccess: boolean;
            testid: string;
          }[];
        }
      | {
          (prevUnsubmittedResults: { isWriting: boolean; testid: string }[]): {
            isWriting: boolean;
            testid: string;
          }[];
        }
      | {
          (prevUnsubmittedResults: { submittingSuccess: boolean; testid: string }[]): {
            submittingSuccess: boolean;
            testid: string;
          }[];
        }
  ) => void;
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
