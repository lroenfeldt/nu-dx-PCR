import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData, useTranslation } from '../hooks';
import { Block, RadioButton } from '../components';
const Debug = () => {
  const { settings, clearSettings, saveSettings, setSettings, exit, setUpdateType, updateType } = useData();
  const hardwareId = settings.device.hardwareId;
  const version = settings.version;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const resetDevice = async () => {
    await clearSettings();
    window.api.logEvents(`Settings loaded: ${JSON.stringify(settings)}`, 'logInfos.txt');
    navigate('/');
  };
  const handleUpdateTypeChange = useCallback(
    async (event) => {
      setUpdateType(event.target.value);
      const newSettings = settings;
      newSettings.user.updateType = event.target.value;
      await saveSettings(newSettings);
      setSettings(newSettings);
    },
    [settings, updateType]
  );

  return (
    <div>
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
      <Block column>
        <h4>Update Settings</h4>

        <Block center>
          <RadioButton
            label="Stable"
            value="stable"
            name="updateType"
            checked={updateType === 'stable'}
            onChange={handleUpdateTypeChange}
          />
          <RadioButton
            label="Beta"
            value="beta"
            name="updateType"
            onChange={handleUpdateTypeChange}
            checked={updateType === 'beta' ? 'checked' : ''}
          />
        </Block>
      </Block>
      <div className="buttonArea">
        <button onClick={() => window.history.back()}>{t('common.back')}</button>
        <button onClick={() => exit()}>{t('common.end')}</button>
        <button onClick={() => resetDevice()}>{t('common.defaultsettings')}</button>
      </div>
    </div>
  );
};

export default Debug;
