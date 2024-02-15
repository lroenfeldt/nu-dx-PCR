import React from "react";
import { IParameter } from "./parseResults";
import { IAccount, ITestProcedure, ITestResult, IDevice } from "./settings";

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

export interface IChildren {
  children: JSX.Element;
}

export interface IError {
  timeStamp: number;
  code: number;
  message: string;
  type: string;
  isSubmitted?: boolean;
}

export interface IErrorCopy {
  timeStamp: number;
  testid: string;
  code: number;
  message: string;
  type: string;
}

export interface IRackVisualRows {
  map(arg0: (row: number, index: number) => JSX.Element): React.ReactNode;
  [index: number]: JSX.Element[];
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

export interface IUseSticky {
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

export interface IAutoControl {
  barcode?: IBarcode;
  type: string;
  position?: string;
  run: string;
  order: string;
  device: string;
}
