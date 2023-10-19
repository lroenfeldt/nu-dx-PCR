import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useData, useTranslation } from "../hooks";
import { Block, RadioButton, Text } from "../components";
const Debug = () => {
  const {
    settings,
    clearSettings,
    saveSettings,
    setSettings,
    exit,
    setUpdateType,
    updateType,
  } = useData();
  const hardwareId = settings.device.hardwareId;
  const version = settings.version;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const resetDevice = async () => {
    await clearSettings();
    window.api.logEvents(`Settings loaded: ${JSON.stringify(settings)}`);
    navigate("/");
  };
  const handleUpdateTypeChange = useCallback(
    async (event: { target: { value: string } }) => {
      setUpdateType(event.target.value);
      const newSettings = settings;
      newSettings.user.updateType = event.target.value;
      await saveSettings(newSettings);
      setSettings(newSettings);
    },
    [settings, updateType]
  );

  return (
    <Block margin={24}>
      <Block className="version">
        <Text h3>Version: {version}</Text>
      </Block>
      <Block className="hardwareId">
        <Text h3>
          {t("debug.hardwareId")}: {hardwareId}
        </Text>
      </Block>
      <Block className="hardwareId">
        <Text h3>{`${t("debug.serialNumber")}: ${
          settings.account?.serialNumber
        }`}</Text>
      </Block>
      <Block className="hardwareId">
        <Text h3>{`${"wellCount"}: ${settings.device.wellCount}`}</Text>
      </Block>
      <Block
        marginTop={24}
        children={
          <>
            <Text h4>Update Settings</Text>
            <Block
              marginTop={10}
              center={true}
              children={
                <>
                  <RadioButton
                    label="Stable"
                    value="stable"
                    name="updateType"
                    checked={updateType === "stable"}
                    onChange={handleUpdateTypeChange}
                  />
                  <RadioButton
                    label="Beta"
                    value="beta"
                    name="updateType"
                    onChange={handleUpdateTypeChange}
                    // checked={updateType === "beta" ? "checked" : ""}
                    checked={updateType === "beta" ? true : false}
                  />
                </>
              }
            />
          </>
        }
      />
    </Block>
  );
};

export default Debug;
