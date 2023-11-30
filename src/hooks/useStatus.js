import React, { useState, useEffect, useCallback } from 'react';
import { useApi, useData } from './';
import onlineStatus from '../api/onlineStatus';

export const useStatus = () => {
  const onlineStatusApi = useApi(onlineStatus.postStatus);
  const { saveSettings, settings, deviceStatus, setErrors, setDbConnection, isStatus, errors } = useData();

  const ping = useCallback(async () => {
    try {
      const response = await onlineStatusApi.request(settings.device.hardwareId, {
        status: deviceStatus,
        timesStamp: new Date().getTime(),
        cyclerVersion: settings.version,
        errors,
      });

      if (response.ok && response.data.account) {
        let newSettings = {
          ...settings,
          account: {
            ...response.data.account,
            authToken: settings.account.authToken,
            initialized: !settings.account.authToken == '' ? true : false,
          },
        };

        await saveSettings(newSettings);
      }
      if (response.problem == 'NETWORK_ERROR' || response?.problem == 'CONNECTION_ERROR') {
        setDbConnection(false);
      } else {
        setDbConnection(true);
        setErrors((errors) => errors.filter((error) => error.type !== 'stillOffline'));
      }

      window.api.logEvents(`ping status response: ${JSON.stringify(response)}`, 'logInfos.txt');
    } catch (err) {
      console.log(err);
      window.api.logEvents('ping status error:' + JSON.stringify(err), 'logErrors.txt');
    }
  }, [deviceStatus, settings, onlineStatusApi, isStatus, errors]);

  return { ping };
};
