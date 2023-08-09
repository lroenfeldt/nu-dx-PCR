import { useCallback, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useApi, useData, useTranslation } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { getPairingCode } from '../api/pairingCode';
import { IGetPairingCode, IGetPairingsCodeApi } from '../types/interfaces/api';
import { IErr, IError } from '../types/interfaces/interfaces';

export default function Pairing() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { settings, setErrors, pairingCode, saveSettings } = useData();
  const getPairingCodeApi: IGetPairingsCodeApi = useApi(getPairingCode as IGetPairingCode) as IGetPairingsCodeApi;

  const pollPairing = useCallback(async () => {
    console.log('pairing with code ' + pairingCode);
    window.api.logEvents('pairing with code ' + pairingCode, 'logInfos.txt');

    try {
      let response = await getPairingCodeApi.request({
        hardwareId: settings.device.hardwareId,
        pairingCode,
      });

      let token;

      if (response.ok && response?.data?.token) {
        token = response?.data.token;
        let newSettings = settings;
        newSettings.account.authToken = token;
        newSettings.account.initialized = true;
        await saveSettings(newSettings);
        navigate('/');
      }
      if (response?.originalError) {
        setErrors((prevErrors: IError[]) =>
          prevErrors
            .filter((error) => error.type !== 'pairing')
            .concat({
              type: 'pairing',
              message: t('errors.pairingFailed', {
                message: response.originalError.message,
              }),
            })
        );
      }
      if (response?.problem == 'NETWORK_ERROR' || response?.problem == 'CONNECTION_ERROR') {
        setErrors((prevErrors: IError[]) =>
          prevErrors
            .filter((error) => error.type !== 'pairing')
            .concat({
              type: 'pairing',
              message: t('errors.pairingDbError'),
            })
        );
      }

      if (response?.problem && response?.problem == 'CLIENT_ERROR') {
        console.log('Error', response.originalError.message);
        window.api.logEvents(`Error: ${JSON.stringify(response.originalError.message)}`, 'logErrors.txt');
        setErrors((prevErrors: IError[]) =>
          prevErrors
            .filter((error) => error.type !== 'pairing')
            .concat({
              type: 'pairing',
              message: t('errors.pairingFailed', {
                message: response.originalError.message,
              }),
            })
        );
      }
    } catch (err) {
      const typedError = err as IErr;
      window.api.logEvents(`getPairingCodeApi err: ${err}`, 'logErrors.txt');
      if (typedError?.response) {
        console.log(typedError.response?.data);
        console.log(typedError.response.status);
        console.log(typedError.response.headers);
        window.api.logEvents(
          `headers: ${JSON.stringify(typedError.response.headers)} status: ${JSON.stringify(
            typedError.response.status
          )} data: ${JSON.stringify(typedError.response?.data)}`,
          'logErrors.txt'
        );
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
  }, [pairingCode]);

  useEffect(() => {
    const checkingInterval = setInterval(() => {
      pollPairing();
    }, 3000);
    return () => clearInterval(checkingInterval);
  }, [pairingCode, settings]);

  // reload paring code if it is not set
  useEffect(() => {
    if (!pairingCode) {
      setErrors((prevErrors: IError[]) => prevErrors.filter((error) => error.type !== 'pairing'));
      navigate('/');
    }
  }, [pairingCode]);

  return (
    <div className="Pairing">
      <h2>{t('pairing.welcome')}</h2>
      <p>{t('pairing.instructions')}</p>
      <div className="pairingContainer">
        <div className="qr-container">
          <h4>{t('pairing.scanQrcode')}</h4>
          <QRCode value={'https://cloud.nu-dx.com/pairing/' + pairingCode} />
        </div>
        <div className="codeContainer">
          <h4>{t('pairing.scanQrcodeInstructions')}</h4>
          <span>{pairingCode}</span>
        </div>
      </div>
    </div>
  );
}
