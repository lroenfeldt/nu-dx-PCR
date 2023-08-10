import { Account, Device, ParameterElement, Result, Settings, Testprocedure, User } from './settings';
import i18n from 'i18n-js';

export interface IPairingCode {
  hardwareId: string;
  pairingCode: number | string;
}

export interface IAlteredResult {
  activeBarcode: IBarcode | null;
  testmethod: Testprocedure;
  style: Object | undefined;
}

export interface IArrowBox {
  children: JSX.Element;
  style: {} | undefined;
  direction: string;
}

export interface IChangeResults {
  activeBarcode: IBarcode | undefined;
  testmethod: Testprocedure;
  isTable: boolean;
}

export interface ICheckmark {
  barcode: IBarcode;
  style: React.CSSProperties | undefined;
  isNinetySix: boolean;
}

export interface IBarcode {
  map: (arg0: (barcode: IBarcode) => IBarcode) => unknown;
  isControl?: boolean | undefined;
  position?: string;
  id: number;
  color?: string;
  parameters: ParameterElement[];
  value: string;
  label: string;
  checking: boolean;
  result: string;
  valid: boolean;
  blocked: boolean;
  barcode: string | number;
  posName: string;
  oldResult: string;
  alteredResult: boolean;
  name: string;
  error: IError | null;
  askRetest: boolean | null;
}

export interface ILineProp {
  result: string;
  barcode: IBarcode;
}

export interface ICustomSelect {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => string;
}

export interface IDropdown {
  children: React.ReactNode;
  title: string;
  elements: string[];
  handleClick?: (arg: string) => string;
}

export interface IInput {
  type?: React.HTMLInputTypeAttribute | undefined;
  value?: string | number | readonly string[] | undefined;
  name?: string | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  placeholder?: string | undefined;
  label: string;
}

export interface IKeyboard {
  dark: boolean;
  style: React.CSSProperties | undefined;
  clear: boolean;
  visible: boolean;
  inputs: any;
  onChange?: ((input: string, e?: MouseEvent | undefined) => string) | undefined | ((value: string) => void);
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
  setInputs: React.Dispatch<React.SetStateAction<string>>;
  inputName: string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isNumeric?: boolean;
  inputValue: string | boolean | null;
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
  testmethod: Testprocedure | null;
}

export interface IRadioButton {
  checked: boolean;
  label: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string | number | readonly string[];
  name: string;
}

export interface IResultsFooter {
  activeBarcode: IBarcode | undefined;
  testmethod: Testprocedure | undefined;
  settings: Settings;
  barcodes: IBarcode[];
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
  isVisible: boolean;
}

export interface ISettingsProp {
  visible: boolean;
}

export interface ISwitch {
  label: string | number;
  onClick: () => void;
  checked: boolean;
}

export interface ITable {
  th: JSX.Element[];
  tr: JSX.Element[][];
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

export interface IError {
  filter?: (err: IError) => boolean;
  map?: (value: IError, index: number, array: IError[]) => JSX.Element | null;
  index?: number;
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
  account: Account;
  device: Device;
  barcodes: IBarcode;
  resultFile: Result;
  orderKey: string;
  hardwareId: string;
  testStarted: number;
  testmethod: string | Object;
  override: boolean;
}

export interface IUseStick {
  top: number;
  id: string;
  stickyClass: string;
}

export interface ICache {
  [key: string]: {
    data: {};
    cachedAt: number;
  };
}

export interface IResultFile {
  split(arg0: RegExp): IParsedResults;
  configFile: {};
  testStarted: number;
}

export interface IParsedResults {
  [key: string]: any;
  slice: (resultsDataStart: string[], resultsDataEnd: string[]) => string[];
  filter: (row: string) => string;
  indexOf: (arg0: string) => any;
  length: number;
  testid: string;
  resultFile: IResultFile;
  testmethod: Testprocedure;
  testConfig: ITestConfig;
  autoControls: Object;
  testStarted: number;
  userId: string;
  override: boolean;
  lotNumber: string | null;
}

export interface IParsedResultsData {
  barcode: IBarcode | null;
  parameters: ParameterElement[];
  label: string;
  alteredResult: boolean;
  oldResult: string;
  isControl: boolean | undefined;
  result: string;
}

export interface IAutoControl {
  barcode: IBarcode | undefined;
  push: (arg0: { type: string; position: string; run: string; order: string; device: string }) => unknown;
  type: string;
  position: string | undefined;
  run: string;
  order: string;
  device: string;
}

export interface IResponse {
  ok: boolean;
  data: any;
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
  signal: boolean;
  isUser: boolean;
  isValid: boolean;
  password: string;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
  setPassword: (arg: string) => void;
  currentUser: User;
  handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  keyboardVisible: boolean;
  setKeyboardVisible: (arg: boolean) => void;
  setIsChargenNrFocused: (arg: boolean) => void;
  isChargenNrFocused: boolean;
  inputName: string;
  setInputName: (arg: string) => void;
  getInputValue: (arg0: string) => string;
  setInputs: React.Dispatch<React.SetStateAction<{}>>;
  inputs: Object;
}

export interface ITextInput {
  // current: {
  //   focus: () => void;
  //   setSelectionRange: (start: number, end: number) => number;
  //   value: string;
  // };
  current: any;
  setSelectionRange: (arg0: Object, arg1: Object) => Object;
}

export interface ILotDoku {
  inputs: Object | undefined;
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
  jwt_decode: (arg0: string) => string;
}
