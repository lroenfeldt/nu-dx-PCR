import React, { useCallback } from 'react';
import axios from 'axios';
import { useData } from './useData';

const useUpdate = () => {
  const { settings, setUpdateAvailable } = useData();

  const getLastVersion = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_APP_GH_TOKEN}`,
        },
      };
      const response = await axios.get('https://api.github.com/repos/lroenfeldt/phoenixdx-poc/releases', config);

      if (settings.version) {
        const currentVersion = settings.version.split('.');
        const newVersion = response.data[0].tag_name.replace('v', '').split('.');
        for (let i = 0; i < currentVersion.length; i++) {
          if (
            parseInt(currentVersion[i]) != parseInt(newVersion[i]) &&
            parseInt(newVersion[i]) > parseInt(currentVersion[i])
          ) {
            setUpdateAvailable(true);
            break;
          } else if (parseInt(newVersion[i]) < parseInt(currentVersion[i])) {
            setUpdateAvailable(false);
            break;
          }
        }
      }

      window.api.logEvents(
        `currentVersion: ${settings.version}, newVersion:${response.data[0].tag_name}`,
        'logInfos.txt'
      );
    } catch (err) {
      window.api.logEvents('getLastVersion error' + JSON.stringify(err), 'logErrors.txt');
      console.log(err);
    }
  }, [settings.version, setUpdateAvailable]);

  return { getLastVersion };
};

export default useUpdate;
