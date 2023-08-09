import { useCallback } from 'react';
import { useApi, useData } from '.';
import { IError, IResponse } from '../types/interfaces/interfaces';
import { postStatus } from '../api/onlineStatus';
import { IPostStatus } from '../types/interfaces/api';

export const useStatus = () => {
  const onlineStatusApi = useApi(postStatus as IPostStatus);
  const { saveSettings, settings, deviceStatus, setErrors, setDbConnection, isStatus } = useData();

  const ping = useCallback(async () => {
    try {
      const response: IResponse = callApi(settings.device.hardwareId, {
        status: deviceStatus,
        timesStamp: new Date().getTime(),
        cyclerVersion: settings.version,
      });
      if (response.ok && response.data.account) {
        let newSettings = {
          ...settings,
          account: {
            ...response.data.account,
            authToken: settings.account.authToken,
            initialized: (!settings.account.authToken as Object) == '' ? true : false,
          },
        };

        await saveSettings(newSettings);
      }
      if (response.problem == 'NETWORK_ERROR' || response?.problem == 'CONNECTION_ERROR') {
        setDbConnection(false);
      } else {
        setDbConnection(true);
        setErrors((errors: IError[]) => errors.filter((error) => error.type !== 'stillOffline'));
      }

      window.api.logEvents(`ping status response: ${JSON.stringify(response)}`, 'logInfos.txt');
    } catch (err) {
      console.log(err);
      window.api.logEvents('ping status error:' + err, 'logErrors.txt');
    }
  }, [deviceStatus, settings, onlineStatusApi, isStatus]);

  return { ping };
};
function callApi(hardwareId: string, arg1: { status: string; timesStamp: number; cyclerVersion: string }): IResponse {
  throw new Error('Function not implemented.');
}
