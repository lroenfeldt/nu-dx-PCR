import { useCallback, useEffect } from "react";
import auth from "../api/auth";
import jwt_decode from "jwt-decode";
import { Oval } from "react-loader-spinner";
import pairingApi from "../api/pairingCode";
import { useNavigate } from "react-router-dom";
import { useData, useApi, useTranslation } from "../hooks";
import { Block, Text } from "../components";

const Bootup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    settings,
    setErrors,
    errors,
    setLoading,
    setSettings,
    pairingCode,
    saveSettings,
    clearSettings,
    setPairingCode,
  } = useData();
  const getPairingCodeApi = useApi<[]>(pairingApi.pollPairingCode);
  const checkTokenApi = useApi(auth.checkToken);

  const navigateToPairing = () => {
    if (settings.isDev) {
      setTimeout(() => {
        navigate("/pairing");
      }, 3000);
    } else {
      navigate("/pairing");
    }
  };

  const appendError = (type, messageKey, additional = {}) => {
    setErrors(
      errors
        .filter((error) => error.type !== type)
        .concat({ type, message: t(messageKey, additional) })
    );
  };

  const getPairingCode = useCallback(async () => {
    setLoading(true);
    if (!settings.device.hardwareId) {
      console.log("Couldnt read MAC Address from Settings.");
      appendError("pairing", "errors.checkInternetConnection");
      return;
    }

    try {
      const response = await getPairingCodeApi.request(
        settings.device.hardwareId,
        {
          deviceType: settings.device.wellCount,
        }
      );
      setLoading(false);
      if (response.ok) {
        navigateToPairing();
        setPairingCode(response?.data?.code);
        return;
      }

      if (["NETWORK_ERROR", "CONNECTION_ERROR"].includes(response.problem)) {
        appendError("pairing", "errors.pairingDbError");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      appendError("pairing", "errors.deviceRegistrationFailed");
    }
  }, [settings, pairingCode]);

  const authenticateToken = useCallback(async () => {
    const token = settings.account.authToken;
    const decoded = jwt_decode(token);
    const difference = decoded.exp * 1000 - Date.now();
    const remDays = Math.floor(difference / 1000 / 60 / 60 / 24);

    if (remDays < 0 && settings.account.allowDaysOffline !== 0) {
      let newSettings = {
        ...settings,
        account: {
          ...settings.account,
          authToken: "",
          initialized: false,
        },
      };
      setLoading(true);
      setSettings(newSettings);
      saveSettings(newSettings);
      navigateToPairing();
      setLoading(false);
      return;
    }

    try {
      const response = await checkTokenApi.request(settings.device.hardwareId, {
        token,
      });
      setLoading(false);
      if (response.ok && response.data.account) {
        const newSettings = {
          ...settings,
          account: {
            ...response?.data.account,
            initialized: true,
          },
        };
        if (newSettings.account.data.config) {
          delete newSettings.account.data.config;
        }
        await saveSettings(newSettings);
        navigate("/selectMethod");
        return;
      }

      if (response?.problem === "CLIENT_ERROR") {
        appendError("auth", "errors.pairingFailed", {
          message: response.originalError.message,
        });
        return;
      }

      if (["NETWORK_ERROR", "CONNECTION_ERROR"].includes(response.problem)) {
        handleNetworkError(remDays);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      appendError("auth", "errors.pairingFailed");
    }
  }, [settings]);

  const handleNetworkError = (remainingDays) => {
    if (settings.account.allowOffline) {
      if (remainingDays > 0) {
        appendError(
          "offline",
          "errors.deviceAuthenticationFailedUseOfflineMode",
          { days: remainingDays }
        );
      } else {
        appendError("offline", "errors.deviceAuthenticationFailedZeroRemDays");
      }
    } else {
      appendError("offlineNotAllow", "errors.checkInternetConnection");
    }
  };

  useEffect(() => {
    if (settings.account.initialized) {
      authenticateToken();
    } else {
      getPairingCode();
    }

    if (!settings.device.wellCount) {
      appendError("init", "errors.deviceInitializationFailed");
    }
  }, [settings]);

  return (
    <Block flex column center height={"90%"} alignCenter>
      <Oval height="100" width="100" color="var(--primary)" />
      <Block marginTop={24}></Block>
      <Text h2>{t("bootup.deviceStart")}</Text>
    </Block>
  );
};

export default Bootup;
