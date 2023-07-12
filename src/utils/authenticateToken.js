import { useCallback } from 'react';
import jwt_decode from 'jwt-decode';
import pairingApi from '../api/pairingCode';
import auth from '../api/auth';
import useApi from '../hooks/useApi';
import { useData } from '../hooks/useData';
import { useNavigate } from 'react-router-dom';
import { getPairingCode } from './getPairingCode';
export const authenticateToken = () => {
  const checkTokenApi = useApi(auth.checkToken);

  const navigate = useNavigate();
  const { settings, saveSettings, clearSettings, setLoading, setErrors, setSettings } = useData();
  return useCallback(async () => {
    setLoading(false);
    const token = settings.account.authToken;
    const decoded = jwt_decode(token);
    let difference = decoded.exp * 1000 - Date.now();

    const remDays = Math.floor(difference / 1000 / 60 / 60 / 24); // days

    if (remDays < 0 && settings.account.allowDaysOffline != 0) {
      let newSettings = {
        ...settings,
        account: {
          ...settings.account,
          authToken: '',
          initialized: false,
        },
      };
      setLoading(true);
      setSettings(newSettings);
      saveSettings(newSettings);
      if (settings.isDev) {
        setTimeout(() => {
          navigate('/pairing');
        }, 3000);
      } else {
        navigate('/pairing');
      }
      setLoading(false);
    }
    try {
      let response = await checkTokenApi.request(settings.device.hardwareId, {
        token,
      });

      window.api.logEvents(` authenticateToken response :${JSON.stringify(response)}`, 'logInfos.txt');
      setLoading(false);
      if (response.ok) {
        if (response.data.account) {
          let newSettings = settings;
          newSettings.account = response?.data.account;
          newSettings.account.initialized = true;
          // newSettings.account.authToken = response?.data.account.authToken
          // newSettings.account.data = response?.data.account.data
          if (newSettings.account.data.config) {
            delete newSettings.account.data.config;
          }

          await saveSettings(newSettings);
          navigate('/selectMethod');
        } else {
          await clearSettings();
        }
      }

      if (response?.problem && response?.problem == 'CLIENT_ERROR') {
        console.log('Error', response);
        window.api.logEvents(`Error:${JSON.stringify(response.originalError.message)}`, 'logErrors.txt');

        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== 'auth')
            .concat({
              type: 'auth',
              message: t('errors.pairingFailed', {
                message: response.originalError.message,
              }),
            })
        );
      }
      if ((response?.problem && response?.problem == 'NETWORK_ERROR') || response?.problem == 'CONNECTION_ERROR') {
        window.api.logEvents(`request:${JSON.stringify(response)}`, 'logErrors.txt');
        if (settings.account.allowOffline) {
          if (settings.account.allowDaysOffline == 0) {
            setErrors((prevErrors) =>
              prevErrors
                .filter((error) => error.type !== 'offlineNotAllow')
                .concat({
                  type: 'offlineNotAllow',
                  message: t('errors.checkInternetConnection'),
                })
            );
          } else if (remDays > 0 && settings.account.allowDaysOffline != 0) {
            setErrors((prevErrors) =>
              prevErrors
                .filter((error) => error.type !== 'init')
                .filter((error) => error.type !== 'offline')
                .concat({
                  type: 'offline',
                  message: t('errors.deviceAuthenticationFailedUseOfflineMode', {
                    days: remDays,
                  }),
                })
            );
          } else if (remDays === 0 && settings.account.allowDaysOffline != 0) {
            setErrors((prevErrors) =>
              prevErrors
                .filter((error) => error.type !== 'init')
                .concat({
                  type: 'offline',
                  message: t('errors.deviceAuthenticationFailedZeroRemDays'),
                })
            );
          } else {
            setErrors((prevErrors) =>
              prevErrors
                .filter((error) => error.type !== 'init')
                .concat({
                  type: 'auth',
                  message: t('errors.deviceAuthenticationFailedRetry'),
                })
            );
          }
        } else {
          setErrors((prevErrors) =>
            prevErrors
              .filter((error) => error.type !== 'offlineNotAllow')
              .concat({
                type: 'offlineNotAllow',
                message: t('errors.checkInternetConnection'),
              })
          );
        }
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err?.response) {
        console.log(err.response?.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log('token invalid');
        window.api.logEvents(
          `headers:${JSON.stringify(err.response.headers)} status:${JSON.stringify(
            err.response.status
          )}  data:${JSON.stringify(err.response?.data)} `,
          'logErrors.txt'
        );
        await clearSettings();
        getPairingCode();
      } else {
        console.log('Error', err.message);
        window.api.logEvents(`Error:${JSON.stringify(err.message)}`, 'logErrors.txt');
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== 'auth')
            .concat({
              type: 'auth',
              message: t('errors.pairingFailed', {
                message: err.message,
              }),
            })
        );
      }
    }
  }, [settings.account.authToken, setSettings, setLoading, setErrors]);
};
