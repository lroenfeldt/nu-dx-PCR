import { IAutoControl, IExtractedBarcodes } from "./parseResults";

export type TcheckUSB = () => Promise<void>;

export type TsaveToUSB = (testid: string, done: boolean) => Promise<boolean>;

export type TsubmitAll = () => void;

export type TgetResults = (filter: boolean) => Promise<void>;

export type TsubmitResult = (testid: string, done: boolean) => Promise<boolean>;

export type TsaveAllToUSB = () => void;

export type TsubmitAutoControls = (
  barcodes: IExtractedBarcodes[],
  testid: string,
  orderKey: string,
  hardwareId: string,
  submitControlUrl: string,
  fetchControlUrl: string
) => Promise<IAutoControl[]>;

export interface IUseResults {
  checkUSB: TcheckUSB;
  saveToUSB: TsaveToUSB;
  submitAll: TsubmitAll;
  getResults: TgetResults;
  submitResult: TsubmitResult;
  saveAllToUSB: TsaveAllToUSB;
  submitAutoControls: TsubmitAutoControls;
}
