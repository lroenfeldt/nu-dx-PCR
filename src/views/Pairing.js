import React, { useCallback, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useApi, useData, useTranslation } from '../hooks';
import { useNavigate } from 'react-router-dom';
import pairingCodeApi from '../api/pairingCode';
import { Errors } from '../components';
export default function Pairing() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { demo, reset, errors, settings, setErrors, pairingCode, saveSettings, loadSettings } =
    useData();
  const getPairingCodeApi = useApi(pairingCodeApi.getPairingCode);

  const pollPairing = useCallback(async () => {
    console.log('pairing with code ' + pairingCode);
    window.api.logEvents('pairing with code ' + pairingCode, 'logInfos.txt');

    try {
      let response = await getPairingCodeApi.request({
        hardwareId: settings.device.hardwareId,
        pairingCode,
      });
      window.api.logEvents(`getPairingCodeApi: ${JSON.stringify(response)}`, 'logInfos.txt');
      console.log(response);

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
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== 'pairing')
            .concat({
              type: 'pairing',
              message: t('default.errors.pairingFailed', {
                message: response.originalError.message,
              }),
            })
        );
      }
      if (response?.problem == 'NETWORK_ERROR' || response?.problem == 'CONNECTION_ERROR') {
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== 'pairing')
            .concat({
              type: 'pairing',
              message: t('default.errors.pairingDbError'),
            })
        );
      }

      if (response?.problem && response?.problem == 'CLIENT_ERROR') {
        console.log('Error', response.originalError.message);
        window.api.logEvents(
          `Error: ${JSON.stringify(response.originalError.message)}`,
          'logErrors.txt'
        );
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== 'pairing')
            .concat({
              type: 'pairing',
              message: t('default.errors.pairingFailed', {
                message: response.originalError.message,
              }),
            })
        );
      }
    } catch (err) {
      window.api.logEvents(`getPairingCodeApi err: ${JSON.stringify(err)}`, 'logErrors.txt');
      if (err?.response) {
        console.log(err.response?.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        window.api.logEvents(
          `headers: ${JSON.stringify(err.response.headers)} status: ${JSON.stringify(
            err.response.status
          )} data: ${JSON.stringify(err.response?.data)}`,
          'logErrors.txt'
        );
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== 'pairing')
            .concat({
              type: 'pairing',
              message: t('default.errors.pairingFailed', {
                message: err.message,
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
  }, []);

  return (
    <div className="Pairing">
      <h2>{t('default.pairing.welcome')}</h2>
      <p>{t('default.pairing.welcome')}</p>
      <div className="pairingContainer">
        <div className="qr-container">
          <h4>{t('default.pairing.scanQrcode')}</h4>
          <QRCode value={'https://poc.myprocomcure.de/pairing/' + pairingCode} />
        </div>
        <div className="codeContainer">
          <h4>{t('default.pairing.scanQrcodeInstructions')}</h4>
          <span>{pairingCode}</span>
        </div>
      </div>
    </div>
  );
}
