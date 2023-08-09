import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData, useApi, useTranslation } from '../hooks';
import { IError } from '../types/interfaces/interfaces';
import { pollPairingCode } from '../api/pairingCode';
import { IGetDeviceTypeApi, IPostStatus } from '../types/interfaces/api';

export const getPairingCode = () => {
  const { settings, setErrors, setPairingCode, setLoading, pairingCode } = useData();
  const getPairingCodeApi: IGetDeviceTypeApi = useApi(pollPairingCode as IPostStatus) as IGetDeviceTypeApi;
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useCallback(async () => {
    setLoading(true);
    setErrors((prevErrors: IError[]) => prevErrors.filter((error: IError) => error.type !== 'pairing'));

    if (settings.device.hardwareId === null) {
      console.log('Couldnt read MAC Adress from Settings.');
      window.api.logEvents('Couldnt read MAC Adress from Settings.', 'logInfos.txt');
      setErrors((prevErrors: IError[]) =>
        prevErrors
          .filter((error: IError) => error.type !== 'pairing')
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
              .filter((error: IError) => error.type !== 'pairing')
              .concat({
                type: 'pairing',
                message: t('errors.pairingDbError'),
              })
          );
        }

        window.api.logEvents(`getPairingCodeApi: ${JSON.stringify(response)}`, 'logInfos.txt');
        window.api.logEvents(`PairingCodeApi: ${JSON.stringify(response?.data?.code)}`, 'logInfos.txt');
      } catch (err: any) {
        console.log(err);
        setLoading(false);
        if (err.response) {
          console.log(err.response?.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          window.api.logEvents(
            `headers:${JSON.stringify(err.response.headers)} status:${JSON.stringify(
              err.response.status
            )}  data:${JSON.stringify(err.response?.data)} `,
            'logErrors.txt'
          );
          setErrors((prevErrors: IError[]) =>
            prevErrors
              .filter((error: IError) => error.type !== 'pairing')
              .concat({
                type: 'pairing',
                message: t('errors.deviceRegistrationFailed'),
              })
          );
        } else if (err.request) {
          console.log(err.request);
          window.api.logEvents(`request:${err}`, 'logErrors.txt');
          setErrors((prevErrors: IError[]) =>
            prevErrors
              .filter((error: IError) => error.type !== 'pairing')
              .concat({
                type: 'pairing',
                message: t('errors.pairingDbError'),
              })
          );
        } else {
          console.log('Error', err.message);
          window.api.logEvents(`Error:${JSON.stringify(err.message)}`, 'logErrors.txt');
          setErrors((prevErrors: IError[]) =>
            prevErrors
              .filter((error: IError) => error.type !== 'pairing')
              .concat({
                type: 'pairing',
                message: t('errors.pairingFailed', {
                  message: err.message,
                }),
              })
          );
        }
      }
    }
  }, [pairingCode, settings, setErrors, setLoading, setPairingCode, t, getPairingCodeApi]);
};
