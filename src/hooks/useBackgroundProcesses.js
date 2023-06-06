import { useEffect, useCallback, useState } from 'react';
import { useData, useResults } from '../hooks';
import { useLocation } from 'react-router-dom';
import { useStatus } from './useStatus';
import useUpdate from './useUpdate';
import { de } from 'date-fns/locale';
function useBackgroundProcesses() {
  const {
    settings,
    deviceStatus,
    isLidOpen,
    openLid,
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
    setResultList(getResultList);
  }, []);

  const autoSubmitUnsubmittedResults = useCallback(async () => {
    if (settings?.account?.autoSubmitUnsubmitted && resultList.length > 0) submitAll();
  }, [submitAll]);

  const checkForTestResultFile = useCallback(async () => {
    if (!testid || deviceStatus === 'IDLE') return;
    let resultPresent = await window.api.checkResultFile(testid);
    setIsResultFilePresent(resultPresent);
  }, [testid, deviceStatus, setIsResultFilePresent]);

  const checkForUpdateAvailable = useCallback(() => {
    // Implement your logic to check for available updates
  }, []);

  const checkConnectionStatus = useCallback(() => {
    // Implement your logic to check for connection status
  }, []);

  const checkForUSB = useCallback(async () => {
    try {
      const usbPresent = await window.api.checkUSB();
      setUSBPresent(usbPresent);
    } catch (error) {
      console.log(error);
      window.api.logEvents(`checkUSB: ${JSON.stringify(error)}`, 'logErrors.txt');
    }
  }, [setUSBPresent]);

  const lidAutoClose = useCallback(() => {
    if (
      deviceStatus === 'IDLE' &&
      isLidOpen &&
      settings?.account?.autoCloseLidMinutes &&
      settings?.account?.autoCloseLidMinutes > 0
    ) {
      openLid(); // openLid can both open and close the lid
    }
  }, [
    deviceStatus,
    isLidOpen,
    settings?.account?.autoCloseLidMinutes,
    settings?.account?.autoCloseLidMinutes,
    openLid,
  ]);

  const autoShutdown = useCallback(() => {
    if (
      deviceStatus === 'IDLE' &&
      settings?.account?.autoShutdownMinutes &&
      Number(settings?.account?.autoShutdownMinutes) > 0 &&
      idleTimestamp &&
      Date.now() - idleTimestamp >= settings?.account?.autoShutdownMinutes * 60 * 1000
    ) {
      if (!settings.isDev) {
        shutdown();
      } else {
        alert('auto shutdown');
      }

      setIdleTimestamp(Date.now()); // Reset idleTimestamp after shutdown
    } else {
      console.log('auto shutdown not working', { deviceStatus }, settings?.account?.autoShutdownMinutes, {
        idleTimestamp,
      });
    }
  }, [deviceStatus, settings?.account?.autoShutdownMinutes, idleTimestamp]);

  useEffect(() => {
    const interval = setInterval(() => {
      autoSubmitUnsubmittedResults();
    }, 1000 * 60 * 5);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getLastVersion();
    }, 1000 * 60 * 5);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const pingInterval = setInterval(() => {
      ping();
    }, 5000);

    return () => clearInterval(pingInterval);
  }, [deviceStatus]);

  useEffect(() => {
    if (deviceStatus === 'IDLE' && !idleTimestamp) {
      setIdleTimestamp(Date.now());
    } else if (deviceStatus !== 'IDLE') {
      setIdleTimestamp(null);
    }
  }, [deviceStatus, idleTimestamp]);

  useEffect(() => {
    let lidAutoCloseInterval = setInterval(() => {
      lidAutoClose();
    }, settings?.account?.autoCloseLidMinutes * 60 * 1000);

    let autoShutdownInterval = setInterval(() => {
      autoShutdown();
      console.log('auto shutdown interval');
    }, settings?.account?.autoCloseLidMinutes * 60 * 1000);

    return () => {
      clearInterval(lidAutoCloseInterval);
      clearInterval(autoShutdownInterval);
    };
  }, [settings?.account?.autoShutdownMinutes, settings?.account?.autoCloseLidMinutes, deviceStatus, idleTimestamp]);

  useEffect(() => {
    let interval;

    const executeChecks = async () => {
      try {
        await checkForUSB();
        //await checkForTestResultFile();
        await checkForUnsubmittedResults();
        if (interval) clearInterval(interval);
        interval = setInterval(executeChecks, 5000);
      } catch (error) {
        console.error(error);
        if (interval) clearInterval(interval);
        interval = setInterval(executeChecks, 10000);
      }
    };

    executeChecks();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);
}

export default useBackgroundProcesses;
