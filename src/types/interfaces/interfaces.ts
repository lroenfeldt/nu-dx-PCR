import React, { ReactElement } from "react";
import i18n from "i18n-js";
import { IParameter } from "./parseResults";
import {
  ISettings,
  IAccount,
  IAccountUser,
  ITestProcedure,
  ITestResult,
  IDevice,
} from "./settings";

export interface IPairingCode {
  hardwareId: string;
  pairingCode: number | string;
}

export interface IActiveBarcode {
  alteredResult: boolean;
  result: string;
  parameters: IParameter;
  value: number;
  id: string | number;
  name: string;
  label: string;
  posName: string;
}

export interface ITestMethod extends ITestProcedure {
  setRemTime?: (remTime: number) => void;
  setErrors?: (errors: { type: string; message: string }[]) => void;
  demo?: boolean;
}

export interface IAlteredResult {
  activeBarcode: IBarcode;
  testmethod: ITestMethod;
  style?: React.CSSProperties;
}

export interface ICheckmark {
  barcode: IBarcode | IActiveBarcode;
  style?: React.CSSProperties;
  isNinetySix?: boolean;
  testmethod: ITestMethod;
}

export interface IArrowBox {
  children: JSX.Element;
  style?: React.CSSProperties;
  direction: string;
}

export interface IChangeResults {
  activeBarcode: IBarcode;
  testmethod: ITestMethod;
  isTable?: boolean;
}

export interface IBarcode {
  isControl?: boolean | null;
  position?: string;
  id: number;
  color?: string;
  parameters?: IParameter;
  value: string;
  label: string;
  checking: boolean;
  result: string;
  valid: boolean;
  blocked?: boolean;
  barcode: string;
  posName: string;
  oldResult?: string;
  alteredResult?: boolean;
  name: string;
  error: string;
  askRetest: boolean | null;
}

export interface ILineProp {
  result?: string;
  barcode: IBarcode;
}

export interface ICustomSelect {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export interface IDropdown {
  children: React.ReactNode;
  title: string;
  elements: string[];
  handleClick?: (arg: string) => void;
}

export interface IInput {
  type?: React.HTMLInputTypeAttribute | undefined;
  value?: string | number | readonly string[] | undefined;
  name?: string | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  placeholder?: string | undefined;
  label: string;
}

export interface IKeyboardRef {
  clearInput: () => void;
  setInput: (value: string) => void;
}

export interface IChildren {
  children: JSX.Element;
}

export interface IWellVisual {
  barcode: IBarcode;
  active: number;
  markActive: (arg: number) => void;
  showResults: boolean;
  testmethod: ITestMethod | null;
}

export interface IRadioButton {
  checked: boolean;
  label: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string | number | readonly string[];
  name: string;
}

export interface IResultsFooter {
  activeBarcode: IActiveBarcode;
  testmethod: ITestMethod;
  settings: ISettings;
  barcodes: IActiveBarcode[];
  locale: string;
  navigate: (arg0: string) => void;
}

export interface ITestedParameter {
  target: string;
  isPrimary: boolean;
}

export interface ISelectTestResults {
  onSelect: () => void;
  onClose: () => void;
}

export interface ISettingsProp {
  visible: boolean;
}

export interface ISwitch {
  label: string | number;
  onClick: () => void;
  checked: boolean;
}
export type TableColumn = string | number | ReactElement | false | null;
export type TableRow = TableColumn[];

export interface ITableProps {
  th: TableColumn[];
  tr: TableRow[];
}

export interface ITestStatus {
  status: string;
}

export interface IActivateKeyboard {
  onClick: () => void;
}

export interface IScrollController {
  onClick: (arg: boolean) => void;
  disabled?: boolean;
}

export interface IHideError {
  type?: string;
  index: number;
  remember?: boolean;
}

export interface IErrorObject {
  filter: any;
  concat: any;
  type: string;
  index: number;
}

export interface IError {
  code: number;
  id: string;
  message: string;
  type: string;
}

export interface IErrorCopy {
  testid: string;
  code: number;
  id: string;
  message: string;
  type: string;
}

export interface IMoveResult {
  testId: string;
}

export interface IProgressBar {
  startTime: number;
  remTime: number;
}

export interface IRackVisualRows {
  map(arg0: (row: number, index: number) => JSX.Element): React.ReactNode;
  [index: number]: JSX.Element[];
}

export interface IToggle {
  isOn: boolean;
  handleToggle: () => void;
}

export interface ITestConfig {
  account: IAccount;
  device: IDevice;
  barcodes: IBarcode;
  resultFile: ITestResult;
  orderKey: string;
  hardwareId: string;
  testStarted: number;
  testmethod: string | Object;
  override: boolean;
}

export interface IUseStick {
  top: number;
  id: string;
  stickyClass: any;
}

export interface ICache {
  [key: string]: {
    data: {};
    cachedAt: number;
  };
}

export interface IResultFile {
  split: any;
  configFile: {};
  testStarted: number;
}

export interface IParsedResults {
  length: number;
  slice(resultsRawDataStart: any, resultsRawDataEnd: unknown): any;
  indexOf(arg0: string): any;
  testid: string;
  resultFile: IResultFile;
  testmethod: ITestMethod;
  testConfig: ITestConfig;
  autoControls: Object;
  testStarted: number;
  userId: string;
  override: boolean;
  lotNumber: string | null;
}

export interface IParsedResultsData {
  barcode: IBarcode | null;
  parameters: IParameter[];
  label: string;
  alteredResult: boolean;
  oldResult: string;
  isControl: any;
  result: string;
}

export interface IAutoControl {
  barcode?: IBarcode;
  type: string;
  position?: string;
  run: string;
  order: string;
  device: string;
}

export interface IPingResponse {
  ok: boolean;
  data: ISettings;
  problem: string;
}

export interface IDecode {
  exp: number;
}

export interface IErr {
  code: string;
  request: XMLHttpRequest;
  message: string;
  response: {
    data: Object;
    status: string;
    headers: Object;
  };
}

export interface IInputContainer {
  t: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
  signal: any;
  isUser: boolean;
  isValid: boolean;
  password: string;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
  setPassword: (arg: string) => void;
  currentUser: IAccountUser;
  handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  keyboardVisible: boolean;
  setKeyboardVisible: (arg: boolean) => void;
  setIsChargenNrFocused: (arg: boolean) => void;
  isChargenNrFocused: boolean;
  inputName: string;
  setInputName: (arg: string) => void;
  getInputValue: any;
  setInputs: React.Dispatch<React.SetStateAction<{}>>;
  inputs: Object;
}

export interface ITextInput {
  textInput: React.RefObject<HTMLInputElement>;
  current: any;
  setSelectionRange: (arg0: {}, arg1: {}) => void;
}

export interface ILotDoku {
  inputs?: Object | undefined;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
  inputName: string;
  setInputName: (arg: string) => void;
  keyboardVisible: boolean;
  setKeyboardVisible: (arg: boolean) => void;
  isChargenNrFocused: boolean;
  setIsChargenNrFocused: (arg: boolean) => void;
}

export interface IDecoded {
  exp: number;
  jwt_decode: (arg0: string) => void;
}

export interface TestmethodProps {
  title: string;
  status: string;
  methodid: string | number;
}
