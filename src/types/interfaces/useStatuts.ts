import { ISettings } from "./settings";

export type SettingsType = {
  device: {
    hardwareId: string;
  };
  version: string;
  account: {
    authToken: string;
    initialized: boolean;
  };
};

export interface UseStatusReturnType {
  ping: () => Promise<void>;
}

export interface IResponse {
  ok: boolean;
  data: ISettings;
  problem: string;
}
