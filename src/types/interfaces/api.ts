import { ApiResponse } from 'apisauce';
import { IPairingCode } from './interfaces';

export interface IPostStatus {
  (arg0?: string, arg1?: {} | string): Promise<ApiResponse<unknown, unknown>>;
}

export interface IGetPairingCode {
  ({ hardwareId, pairingCode }: IPairingCode): Promise<ApiResponse<unknown, unknown>>;
}

export interface ICheck {
  request: (arg0: string, arg1: { token: string }) => Promise<any>;
}

export interface IGetDeviceTypeApi {
  request: (arg0: string, arg1: { deviceType: Object }) => Promise<any>;
}

export interface IGetPairingsCodeApi {
  request: (arg0: { hardwareId: string; pairingCode: string | null }) => Promise<any>;
}
