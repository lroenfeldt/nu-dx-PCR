import { useState, useEffect } from "react";
import { useData, useTranslation } from "../../hooks";
import "./style.css";

const ShutdownNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const { t } = useTranslation();
  const { idleTimestamp, setIdleTimestamp, settings, deviceStatus } = useData();

  const handleContinue = () => {
    setShowNotification(false);
    setIdleTimestamp(null);
  };

  const handleAccept = () => {
    setShowNotification(false);
  };

  let status = false;
  if (
    deviceStatus === "IDLE" &&
    settings?.account?.autoShutdownMinutes &&
    Number(settings?.account?.autoShutdownMinutes) > 0 &&
    idleTimestamp &&
    Date.now() - idleTimestamp >=
      (settings?.account?.autoShutdownMinutes - 1) * 60 * 1000 &&
    Date.now() - idleTimestamp <
      settings?.account?.autoShutdownMinutes * 60 * 1000
  )
    status = true;
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (status) {
      setShowNotification(true);
      setCountdown(60);

      timeout = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000); // Countdown decreases every second
    } else {
      setShowNotification(false);
    }
    return () => {
      clearInterval(timeout);
    };
  }, [
    deviceStatus,
    settings?.account?.autoShutdownMinutes,
    idleTimestamp,
    setShowNotification,
    setCountdown,
    status,
  ]);

  if (!showNotification || countdown <= 0) {
    return null;
  }

  return (
    <div className="shutdown-notification">
      <p
        dangerouslySetInnerHTML={{
          __html: t("common.deviceTurnOffInfo", { time: countdown }),
        }}
      />
      <button onClick={handleAccept}>{t("common.acceptPowerOff")}</button>
      <button onClick={handleContinue}>{t("common.continue")}</button>
    </div>
  );
};

export default ShutdownNotification;
