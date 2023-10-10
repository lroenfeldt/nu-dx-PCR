// global.d.ts
import {
  IGetResultResponse,
  ITestObject,
} from "../../electron/interfaces/interfaces";
import { IBarcode } from "./interfaces/interfaces";
import { ITestConfig, ITestMethod } from "./interfaces/parseResults";
import { IConfigFile, ISettings, ITestResult } from "./interfaces/settings";

declare global {
  interface Window {
    api: {
      getConfig: () => ConfigType;
      saveConfig: (config: ConfigType) => boolean;
      clearConfig: () => boolean;
      checkResultFile: (testid: string) => boolean;
      moveResultFile: (testid: string) => boolean;
      getResult: (testid: string, testDone: boolean) => any;
      checkUSB: () => boolean;
      saveToUSB: (testid: string, results: any) => void;
      power: (reboot: string) => void;
      startLineGene: (
        testid: string,
        xmlContent: string,
        settings: any,
        barcodes: IBarcode[],
        testmethod: string
      ) => IGetResultResponse;
      endLineGene: () => boolean;
      toggleLid: () => boolean;
      moveFiles: (testid: string) => void;
      getVersion: () => string;
      updateStatus: (callback: CallbackType) => void;
      getUnsubmitted: () => any;
      getTests: () => ITestObject[];
      exit: () => void;
      logEvents: (message: string) => void;
      launchUpdates: () => void;
      archiveRun: () => void;
      downloadApp: () => void;
      editResults: (testid: string, results: Record<string, string>) => boolean;
      deleteAllOverrides: () => void;
      deleteOverride: (testid: string) => void;
      relaunchApp: () => void;
      copyLogos: () => void;
    };
  }
}

type ConfigType = ISettings;
type CallbackType = (event: IpcRendererEvent, ...args: any[]) => void;
