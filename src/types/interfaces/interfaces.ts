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
