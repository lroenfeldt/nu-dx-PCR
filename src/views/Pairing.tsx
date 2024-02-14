import { useCallback, useEffect, FC } from "react";
import QRCode from "qrcode.react";
import { useApi, useData, useTranslation } from "../hooks";
import { useNavigate } from "react-router-dom";
import pairingCodeApi from "../api/pairingCode";

const Pairing: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { errors, settings, setErrors, pairingCode, saveSettings } = useData();
  const getPairingCodeApi = useApi(pairingCodeApi.getPairingCode);

  const pollPairing = useCallback(async () => {
    window.api.logEvents("pairing with code " + pairingCode);

    try {
      let response: any = await getPairingCodeApi.request({
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
        navigate("/");
      }
      if (response?.originalError) {
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== "pairing")
            .concat({
              timeStamp: Date.now(),
              code: 1000,
              type: "pairing",
              message: t("errors.pairingFailed", {
                message: response.originalError.message,
              }),
            })
        );
      }
      if (
        response?.problem == "NETWORK_ERROR" ||
        response?.problem == "CONNECTION_ERROR"
      ) {
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== "pairing")
            .concat({
              timeStamp: Date.now(),
              code: 1000,
              type: "pairing",
              message: t("errors.pairingDbError"),
            })
        );
      }

      if (response?.problem && response?.problem == "CLIENT_ERROR") {
        console.error("Error", response.originalError.message);
        window.api.logEvents(
          `Error: ${JSON.stringify(response.originalError.message)}`
        );
        setErrors(
          errors
            .filter((error) => error.type !== "pairing")
            .concat({
              timeStamp: Date.now(),
              code: 1000,
              type: "pairing",
              message: t("errors.pairingFailed", {
                message: response.originalError.message,
              }),
            })
        );
      }
    } catch (err: any) {
      window.api.logEvents(`getPairingCodeApi err: ${err}`);
      if (err?.response) {
        console.error(err.response?.data);
        window.api.logEvents(
          `headers: ${JSON.stringify(
            err.response.headers
          )} status: ${JSON.stringify(
            err.response.status
          )} data: ${JSON.stringify(err.response?.data)}`
        );
        setErrors(
          errors
            .filter((error) => error.type !== "pairing")
            .concat({
              timeStamp: Date.now(),
              code: 1000,
              type: "pairing",
              message: t("errors.pairingFailed", {
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
  }, [pairingCode, settings]);

  // reload paring code if it is not set
  useEffect(() => {
    if (!pairingCode) {
      setErrors(errors.filter((error) => error.type !== "pairing"));
      navigate("/");
    }
  }, [pairingCode]);

  return (
    <div className="Pairing">
      <h2>{t("pairing.welcome")}</h2>
      <p>{t("pairing.instructions")}</p>
      <div className="pairingContainer">
        <div className="qr-container">
          <h4>{t("pairing.scanQrcode")}</h4>
          <QRCode value={"https://cloud.nu-dx.com/pairing/" + pairingCode} />
        </div>
        <div className="codeContainer">
          <h4>{t("pairing.scanQrcodeInstructions")}</h4>
          <span>{pairingCode}</span>
        </div>
      </div>
    </div>
  );
};

export default Pairing;
