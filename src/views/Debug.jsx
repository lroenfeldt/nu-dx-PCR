import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData, useTranslation } from '../hooks';
const Debug = () => {
  const { settings, clearSettings, setSettings, exit } = useData();
  const hardwareId = settings.device.hardwareId;
  const version = settings.version;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const resetDevice = async () => {
    await clearSettings();
    window.api.logEvents(`Settings loaded: ${JSON.stringify(settings)}`, 'logInfos.txt');
    navigate('/');
  };

  return (
    <div className="Debug">
      <div className="version">
        <h3>Version: {version}</h3>
      </div>
      <div className="hardwareId">
        <h3>
          {t('debug.hardwareId')}: {hardwareId}
        </h3>
      </div>
      <div className="hardwareId">
        <h3>{`${t('debug.serialNumber')}: ${settings.device?.serialNumber}`}</h3>
      </div>
      <div className="hardwareId">
        <h3>{`${'wellCount'}: ${settings.device.wellCount}`}</h3>
      </div>
      <div className="buttonArea">
        <button onClick={() => window.history.back()}>{t('common.back')}</button>
        <button onClick={() => exit()}>{t('common.end')}</button>
        <button onClick={() => resetDevice()}>{t('common.defaultsettings')}</button>
      </div>
    </div>
  );
};

export default Debug;
