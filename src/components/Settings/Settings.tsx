import React, { useCallback, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import ArrowBox from "../ArrowBox";
import deFlag from "../../assets/images/flags/de.png";
import enFlag from "../../assets/images/flags/en.png";
import frFlag from "../../assets/images/flags/fr.png";
import { GrUpdate } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useData, useTranslation } from "../../hooks";
import Dropdown from "../Dropdown/Dropdown";
import Switch from "../Switch/Switch";
import defaultBarcodes from "../../utils/defaultBarcodes";
import "./css/settings.css";

interface SettingsProps {
  visible: boolean;
}

const Settings: React.FC<SettingsProps> = ({ visible }) => {
  const {
    setBarcodes,
    saveSettings,
    settings,
    setMenuOpen,
    clearSettings,
    updateAvailable,
    setUpdateAvailable,
  } = useData();

  const { t, setLocale, locale } = useTranslation();
  const navigate = useNavigate();
  const resetDevice = async () => {
    setMenuOpen(null);
    await clearSettings();
    window.api.logEvents(`Settings loaded: ${JSON.stringify(settings)}`);
    navigate("/");
  };

  const handleWellCount = useCallback(async () => {
    const newSettings = settings;
    newSettings.device.wellCount = settings.device.wellCount === 96 ? 16 : 96;
    newSettings.user.ntcPos =
      newSettings.device.wellCount === 96 ? "B01" : "A02";
    setBarcodes(defaultBarcodes(newSettings));
    await saveSettings(newSettings);
  }, [settings, setBarcodes, saveSettings]);

  const handleLocale = useCallback(
    async (newLocale: "de" | "en" | "fr") => {
      setLocale(newLocale);
      const newSettings = settings;
      newSettings.user.locale = newLocale;
      await saveSettings(newSettings);
    },
    [locale, setLocale, settings, saveSettings]
  );

  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const handleAutoUpdate = () => {
    autoUpdate ? setAutoUpdate(false) : setAutoUpdate(true);
  };

  window.api.autoUpdate(autoUpdate);

  return (
    <div>
      <ArrowBox direction={`top ${visible ? "active" : "disable"}`}>
        <div className="settingsContent">
          <b style={{ fontSize: 20 }}>{settings.account.data.name}</b>
          <span style={{ fontSize: 12 }}>
            {settings.account.initialized && settings.account.data.email}
          </span>
          <div className="settings">
            <div>
              <Dropdown>
                <>
                  <div onClick={(e) => handleLocale("de")}>
                    Deutsch <img width={20} height={10} src={deFlag} />
                  </div>
                  <div onClick={() => handleLocale("en")}>
                    English <img width={20} height={10} src={enFlag} />
                  </div>
                  <div onClick={() => handleLocale("fr")}>
                    Français <img width={20} height={10} src={frFlag} />
                  </div>
                </>
              </Dropdown>
            </div>

            <button
              className="settings-item"
              onClick={() => resetDevice()}
              style={{ color: "red" }}
            >
              {t("common.logout")} <FiLogOut />
            </button>
            {updateAvailable && (
              <button
                onClick={async () => {
                  setMenuOpen(null);
                  await window.api.relaunchApp();
                }}
                className="settings-item"
              >
                {t("common.update")} <GrUpdate />
              </button>
            )}
          </div>
          {/* {settings.isDev && (
            <Switch
              label={settings.device.wellCount}
              onClick={handleWellCount}
              checked={settings.device.wellCount === 96}
            />
          )} */}

          <span className="auto-update">{t("common.autoUpdate")}</span>
          <Switch
            label={autoUpdate ? t("common.on") : t("common.off")}
            onClick={handleAutoUpdate}
            checked={autoUpdate}
          />

          <span className="serial-number">
            S/N: {settings.account.serialNumber}
          </span>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {t("common.hardwareId")}:{" " + settings.device.hardwareId}
            </span>
            <span>v{settings.version}</span>
          </div>
        </div>
      </ArrowBox>
    </div>
  );
};

export default Settings;
