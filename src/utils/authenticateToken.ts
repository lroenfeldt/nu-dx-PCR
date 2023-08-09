import { useCallback } from 'react';
import jwt_decode from 'jwt-decode';
import { checkToken } from '../api/auth';
import useApi from '../hooks/useApi';
import { useData } from '../hooks/useData';
import { useNavigate } from 'react-router-dom';
import { getPairingCode } from './getPairingCode';
import { t } from 'i18n-js';
import { IDecode, IErr, IError } from '../types/interfaces/interfaces';
import { ICheck, IPostStatus } from '../types/interfaces/api';

export const authenticateToken = () => {
  const checkTokenApi: ICheck = useApi(checkToken as IPostStatus) as ICheck;

  const navigate = useNavigate();
  const { settings, saveSettings, clearSettings, setLoading, setErrors, setSettings } = useData();
  return useCallback(async () => {
    setLoading(false);
    const token = settings.account.authToken;
    const decoded: IDecode = jwt_decode(token);
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

        setErrors((prevErrors: IError[]) =>
          prevErrors
            .filter((error: IError) => error.type !== 'auth')
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
            setErrors((prevErrors: IError[]) =>
              prevErrors
                .filter((error: IError) => error.type !== 'offlineNotAllow')
                .concat({
                  type: 'offlineNotAllow',
                  message: t('errors.checkInternetConnection'),
                })
            );
          } else if (remDays > 0 && settings.account.allowDaysOffline != 0) {
            setErrors((prevErrors: IError[]) =>
              prevErrors
                .filter((error: IError) => error.type !== 'init')
                .filter((error: IError) => error.type !== 'offline')
                .concat({
                  type: 'offline',
                  message: t('errors.deviceAuthenticationFailedUseOfflineMode', {
                    days: remDays,
                  }),
                })
            );
          } else if (remDays === 0 && settings.account.allowDaysOffline != 0) {
            setErrors((prevErrors: IError[]) =>
              prevErrors
                .filter((error: IError) => error.type !== 'init')
                .concat({
                  type: 'offline',
                  message: t('errors.deviceAuthenticationFailedZeroRemDays'),
                })
            );
          } else {
            setErrors((prevErrors: IError[]) =>
              prevErrors
                .filter((error: IError) => error.type !== 'init')
                .concat({
                  type: 'auth',
                  message: t('errors.deviceAuthenticationFailedRetry'),
                })
            );
          }
        } else {
          setErrors((prevErrors: IError[]) =>
            prevErrors
              .filter((error: IError) => error.type !== 'offlineNotAllow')
              .concat({
                type: 'offlineNotAllow',
                message: t('errors.checkInternetConnection'),
              })
          );
        }
      }
    } catch (err) {
      const typedError = err as IErr;
      // No guarantee that the error in the catch block will be an Error instance ahead of time,
      // so TypeScript sets its type to unknown to avoid any unexpected runtime errors.
      // Use a type guard to narrow down the type of the object before accessing a specific property.
      // One methode to fix the error is using use a type assertion.
      // in this case const typedError = err as IErr;
      // for more informations check: https://bobbyhadz.com/blog/typescript-catch-clause-variable-type-annotation-must-be
      if (err) {
        console.log(typedError);
        setLoading(false);
        console.log(typedError?.response.data);
        console.log(typedError?.response.status);
        console.log(typedError?.response.headers);
        console.log('token invalid');
        window.api.logEvents(
          `headers:${JSON.stringify(typedError?.response.headers)} status:${JSON.stringify(
            typedError?.response.status
          )}  data:${JSON.stringify(typedError?.response.data)} `,
          'logErrors.txt'
        );
        await clearSettings();
        getPairingCode();
      } else {
        console.log('Error', typedError?.message);
        window.api.logEvents(`Error:${JSON.stringify(typedError?.message)}`, 'logErrors.txt');
        setErrors((prevErrors: IError[]) =>
          prevErrors
            .filter((error: IError) => error.type !== 'auth')
            .concat({
              type: 'auth',
              message: t('errors.pairingFailed', {
                message: typedError?.message,
              }),
            })
        );
      }
    }
  }, [settings.account.authToken, setSettings, setLoading, setErrors]);
};
