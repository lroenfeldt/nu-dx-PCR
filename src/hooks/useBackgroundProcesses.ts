import { useEffect, useCallback } from "react";
import { useData, useResults } from "../hooks";
import { useLocation } from "react-router-dom";
import { useStatus } from "./useStatus";
import useUpdate from "./useUpdate";

function useBackgroundProcesses() {
  const {
    settings,
    deviceStatus,
    isLidOpen,
    toggleLid,
    shutdown,
    loadSettings,
    resultList,
    setResultList,
    setIsResultFilePresent,
    testid,
    setUSBPresent,
    idleTimestamp,
    setIdleTimestamp,
  } = useData();
  const { submitAll } = useResults();
  const location = useLocation();

  const { ping } = useStatus();
  const { getLastVersion } = useUpdate();

  const checkForUnsubmittedResults = useCallback(async () => {
    const getResultList = await window.api.getUnsubmitted();

    if (getResultList.length !== resultList.length) {
      setResultList(getResultList);
    }
  }, [resultList]);

  const autoSubmitUnsubmittedResults = useCallback(async () => {
    console.log(settings?.account?.autoSubmitResults, resultList.length);
    if (settings?.account?.autoSubmitResults && resultList.length > 0)
      submitAll();
  }, [resultList, settings?.account?.autoSubmitResults]);

  const checkForTestResultFile = useCallback(async () => {
    if (!testid || deviceStatus === "IDLE") return;
    let resultPresent = await window.api.checkResultFile(testid);
    setIsResultFilePresent(resultPresent);
  }, [testid, deviceStatus, setIsResultFilePresent]);

  const checkForUSB = useCallback(async () => {
    try {
      const usbPresent = window.api.checkUSB();
      setUSBPresent(usbPresent);
    } catch (error) {
      console.log(error);
      window.api.logEvents(`checkUSB: ${error}`);
    }
  }, [setUSBPresent]);

  const lidAutoClose = useCallback(() => {
    if (
      deviceStatus === "IDLE" &&
      isLidOpen &&
      settings?.account?.autoCloseLidMinutes &&
      settings?.account?.autoCloseLidMinutes > 0 &&
      settings?.device.wellCount == 96
    ) {
      toggleLid(); // toggleLid can both open and close the lid
    }
  }, [
    deviceStatus,
    isLidOpen,
    settings?.account?.autoCloseLidMinutes,
    settings?.account?.autoCloseLidMinutes,
  ]);

  const autoShutdown = useCallback(() => {
    if (
      deviceStatus === "IDLE" &&
      settings?.account?.autoShutdownMinutes &&
      Number(settings?.account?.autoShutdownMinutes) > 0 &&
      idleTimestamp &&
      Date.now() - idleTimestamp >=
        settings?.account?.autoShutdownMinutes * 60 * 1000
    ) {
      if (!settings.isDev) {
        shutdown();
      } else {
        alert("auto shutdown");
      }

      setIdleTimestamp(Date.now()); // Reset idleTimestamp after shutdown
    }
  }, [deviceStatus, settings?.account?.autoShutdownMinutes, idleTimestamp]);

  useEffect(() => {
    const interval = setInterval(() => {
      autoSubmitUnsubmittedResults();
    }, 1000 * 60 * 5); // 5 minutes
    return () => clearInterval(interval);
  }, [resultList, settings?.account?.autoSubmitResults]);

  useEffect(() => {
    const interval = setInterval(() => {
      getLastVersion();
    }, 1000 * 60); // 1h
    return () => clearInterval(interval);
  }, [settings.user.updateType]);

  useEffect(() => {
    const pingInterval = setInterval(() => {
      ping();
    }, 5000); // 5 seconds

    return () => clearInterval(pingInterval);
  }, [deviceStatus, settings]);

  useEffect(() => {
    if (deviceStatus === "IDLE" && !idleTimestamp) {
      setIdleTimestamp(Date.now());
    } else if (deviceStatus !== "IDLE") {
      setIdleTimestamp(null);
    }
  }, [deviceStatus, idleTimestamp]);

  useEffect(() => {
    let lidAutoCloseInterval = setInterval(() => {
      lidAutoClose();
    }, 1000);

    return () => {
      clearInterval(lidAutoCloseInterval);
    };
  }, [settings?.account?.autoCloseLidMinutes, isLidOpen]);
  useEffect(() => {
    let autoShutdownInterval = setInterval(() => {
      autoShutdown();
    }, 1000);

    return () => {
      clearInterval(autoShutdownInterval);
    };
  }, [settings?.account?.autoShutdownMinutes, deviceStatus, idleTimestamp]);
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const executeChecks = async () => {
      try {
        await checkForUSB();
        //await checkForTestResultFile();
        await checkForUnsubmittedResults();

        if (interval) clearInterval(interval);
        interval = setInterval(executeChecks, 5000); // 5 seconds
      } catch (error) {
        console.error(error);
        if (interval) clearInterval(interval);
        interval = setInterval(executeChecks, 10000); // 10 seconds
      }
    };

    executeChecks();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resultList]);
}

export default useBackgroundProcesses;
