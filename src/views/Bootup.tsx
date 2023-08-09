import { useCallback, useEffect } from 'react';
import { checkToken } from '../api/auth';
import jwt_decode from 'jwt-decode';
import { Oval } from 'react-loader-spinner';
import { pollPairingCode } from '../api/pairingCode';
import { useNavigate } from 'react-router-dom';
import { useData, useApi, useTranslation } from '../hooks';
import { IDecoded, IErr, IError } from '../types/interfaces/interfaces';
import { ICheck, IGetDeviceTypeApi, IPostStatus } from '../types/interfaces/api';

const Bootup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    settings,
    setErrors,
    setLoading,
    setSettings,
    pairingCode,
    loadSettings,
    saveSettings,
    clearSettings,
    setPairingCode,
  } = useData();
  const getPairingCodeApi: IGetDeviceTypeApi = useApi(pollPairingCode as IPostStatus) as IGetDeviceTypeApi;
  /**
   * @description Get pairing code from server
   */
  const getPairingCode = useCallback(async () => {
    setLoading(true);
    setErrors((prevErrors: IError[]) => prevErrors.filter((error) => error.type !== 'pairing'));

    if (settings.device.hardwareId === null) {
      console.log('Couldnt read MAC Adress from Settings.');
      window.api.logEvents('Couldnt read MAC Adress from Settings.', 'logInfos.txt');
      setErrors((prevErrors: IError[]) =>
        prevErrors
          .filter((error) => error.type !== 'pairing')
          .concat({
            type: 'pairing',
            message: t('errors.checkInternetConnection'),
          })
      );
    } else {
      try {
        console.log('trying to fetch pairing code');
        window.api.logEvents('trying to fetch pairing code', 'logInfos.txt');

        let response = await getPairingCodeApi.request(settings.device.hardwareId, {
          deviceType: settings.device.wellCount,
        });

        setLoading(false);
        if (response.ok) {
          if (settings.isDev) {
            setTimeout(() => {
              navigate('/pairing');
            }, 3000);
          } else {
            navigate('/pairing');
          }
        }

        setPairingCode(response?.data?.code);
        if (response.problem == 'NETWORK_ERROR' || response?.problem == 'CONNECTION_ERROR') {
          setErrors((prevErrors: IError[]) =>
            prevErrors
              .filter((error) => error.type !== 'pairing')
              .concat({
                type: 'pairing',
                message: t('errors.pairingDbError'),
              })
          );
        }

        window.api.logEvents(`getPairingCodeApi: ${JSON.stringify(response)}`, 'logInfos.txt');
        window.api.logEvents(`PairingCodeApi: ${JSON.stringify(response?.data?.code)}`, 'logInfos.txt');
      } catch (err) {
        const typedError = err as IErr;
        console.log(typedError);
        setLoading(false);
        if (typedError.response) {
          console.log(typedError.response?.data);
          console.log(typedError.response.status);
          console.log(typedError.response.headers);
          window.api.logEvents(
            `headers:${JSON.stringify(typedError.response.headers)} status:${JSON.stringify(
              typedError.response.status
            )}  data:${JSON.stringify(typedError.response?.data)} `,
            'logErrors.txt'
          );
          setErrors((prevErrors: IError[]) =>
            prevErrors
              .filter((error) => error.type !== 'pairing')
              .concat({
                type: 'pairing',
                message: t('errors.deviceRegistrationFailed'),
              })
          );
        } else if (typedError.request) {
          console.log(typedError.request);
          window.api.logEvents(`request:${typedError}`, 'logErrors.txt');
          setErrors((prevErrors: IError[]) =>
            prevErrors
              .filter((error) => error.type !== 'pairing')
              .concat({
                type: 'pairing',
                message: t('errors.pairingDbError'),
              })
          );
        } else {
          console.log('Error', typedError.message);
          window.api.logEvents(`Error:${JSON.stringify(typedError.message)}`, 'logErrors.txt');
          setErrors((prevErrors: IError[]) =>
            prevErrors
              .filter((error) => error.type !== 'pairing')
              .concat({
                type: 'pairing',
                message: t('errors.pairingFailed', {
                  message: typedError.message,
                }),
              })
          );
        }
      }
    }
  }, [pairingCode, settings, setErrors, setLoading, setPairingCode, navigate, t, getPairingCodeApi]);

  const checkTokenApi: ICheck = useApi(checkToken as IPostStatus) as ICheck;
  /**
   * @description Check if token is valid and get user data
   **/
  const authenticateToken = useCallback(async () => {
    setLoading(false);
    const token = settings.account.authToken;
    const decoded: IDecoded = jwt_decode(token);
    let difference = decoded.exp * 1000 - Date.now();

    const remDays = Math.floor(difference / 1000 / 60 / 60 / 24);
    if (remDays < 0 && settings.account.allowDaysOffline != 0) {
      console.log('Token expired');
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
      if (
        (response?.data?.error == 'Invalid Token' && response?.data?.valid == false) ||
        response?.data?.error == 'Could not find device'
      ) {
        setErrors((prevErrors: IError[]) => prevErrors.filter((error) => error.type !== 'auth'));
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
      if (response?.problem && response?.problem == 'CLIENT_ERROR') {
        console.log('Error', response.originalError.message);
        window.api.logEvents(`Error:${JSON.stringify(response.originalError.message)}`, 'logErrors.txt');
        setErrors((prevErrors: IError[]) =>
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
            setErrors((prevErrors: IError[]) =>
              prevErrors
                .filter((error) => error.type !== 'offlineNotAllow')
                .concat({
                  type: 'offlineNotAllow',
                  message: t('errors.checkInternetConnection'),
                })
            );
          } else if (remDays > 0 && settings.account.allowDaysOffline != 0) {
            setErrors((prevErrors: IError[]) =>
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
            setErrors((prevErrors: IError[]) =>
              prevErrors
                .filter((error) => error.type !== 'offline')
                .concat({
                  type: 'offline',
                  message: t('errors.deviceAuthenticationFailedZeroRemDays'),
                })
            );
          } else {
            setErrors((prevErrors: IError[]) =>
              prevErrors
                .filter((error) => error.type !== 'auth')
                .concat({
                  type: 'auth',
                  message: t('errors.deviceAuthenticationFailedRetry'),
                })
            );
          }
        } else {
          setErrors((prevErrors: IError[]) =>
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
      const typedError = err as IErr;
      console.log(typedError);
      setLoading(false);
      if (typedError?.response) {
        console.log(typedError.response?.data);
        console.log(typedError.response.status);
        console.log(typedError.response.headers);
        console.log('token invalid');
        window.api.logEvents(
          `headers:${JSON.stringify(typedError.response.headers)} status:${JSON.stringify(
            typedError.response.status
          )}  data:${JSON.stringify(typedError.response?.data)} `,
          'logErrors.txt'
        );
        await clearSettings();
        await getPairingCode();
      } else {
        console.log('Error', typedError.message);
        window.api.logEvents(`Error:${JSON.stringify(typedError.message)}`, 'logErrors.txt');
        setErrors((prevErrors: IError[]) =>
          prevErrors
            .filter((error) => error.type !== 'auth')
            .concat({
              type: 'auth',
              message: t('errors.pairingFailed', {
                message: typedError.message,
              }),
            })
        );
      }
    }
  }, [settings.account.authToken, setSettings]);

  useEffect(() => {
    if (settings.account.initialized) {
      authenticateToken();
      console.log('initialized, attempting authentication');
      window.api.logEvents('initialized, attempting authentication', 'logInfos.txt');
    } else {
      getPairingCode();
    }
    if (!settings.device.wellCount) {
      setErrors((prevErrors: IError[]) =>
        prevErrors
          .filter((error) => error.type !== 'init')
          .concat({
            type: 'init',
            message: t('errors.deviceInitializationFailed'),
          })
      );
    }
  }, [settings.device.wellCount]);

  return (
    <div className="Bootup">
      <div className="spinnerContainer">
        <Oval height="100" width="100" color="var(--primary)" />
      </div>
      <h2>{t('bootup.deviceStart')}</h2>
    </div>
  );
};

export default Bootup;
