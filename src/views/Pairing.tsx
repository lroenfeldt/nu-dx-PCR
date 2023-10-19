import { useCallback, useEffect, FC } from "react";
import QRCode from "qrcode.react";
import { useApi, useData, useTranslation } from "../hooks";
import { useNavigate } from "react-router-dom";
import pairingCodeApi from "../api/pairingCode";
import { Block, Text } from "../components";

const Pairing: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { errors, settings, setErrors, pairingCode, saveSettings } = useData();
  const getPairingCodeApi = useApi(pairingCodeApi.getPairingCode);

  const pollPairing = useCallback(async () => {
    console.log("pairing with code " + pairingCode);
    window.api.logEvents("pairing with code " + pairingCode);

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
        navigate("/");
      }
      if (response?.originalError) {
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== "pairing")
            .concat({
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
              type: "pairing",
              message: t("errors.pairingDbError"),
            })
        );
      }

      if (response?.problem && response?.problem == "CLIENT_ERROR") {
        console.log("Error", response.originalError.message);
        window.api.logEvents(
          `Error: ${JSON.stringify(response.originalError.message)}`
        );
        setErrors(
          errors
            .filter((error) => error.type !== "pairing")
            .concat({
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
        console.log(err.response?.data);
        console.log(err.response.status);
        console.log(err.response.headers);
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
    <Block flex column center height={"100%"} alignCenter>
      <Block>
        {" "}
        <Text h2>{t("pairing.welcome")}</Text>
        <Text h4>{t("pairing.instructions")}</Text>
        <Text h4>{t("pairing.ways")}</Text>
      </Block>
      <Block flex marginTop={40}>
        <Block>
          <Text h4>{t("pairing.scanQrcode")}</Text>
          <Block marginTop={24}></Block>
          <QRCode
            style={{ marginLeft: "110.5px" }}
            size={176}
            value={"https://cloud.nu-dx.com/pairing/" + pairingCode}
          />
        </Block>
        <Block
          marginLeft={24}
          marginRight={24}
          borderRight="4px solid black"
        ></Block>
        <Block width={380}>
          <Text h4>{t("pairing.scanQrcodeInstructions")}</Text>
          <Block flex column center height={"50%"} alignCenter>
            {" "}
            <Text h1>{pairingCode}</Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Pairing;
