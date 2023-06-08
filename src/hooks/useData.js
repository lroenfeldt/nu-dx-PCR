import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import useResults from './useResults';
import defaultBarcodes from '../utils/defaultBarcodes';
import { useTranslation } from './useTranslation';
export const DataContext = React.createContext({});
/**
 * Provides a stateful value for data and a function to update it.
 * @param {object} children
 * @returns {object} data, setData
 * @example const { data, setData } = useData();
 * */
export function DataProvider({ children }) {
  const [user, setUser] = useState(null);
  const [demo, setDemo] = useState(false);
  const [errors, setErrors] = useState([]);
  const [testid, setTestid] = useState(null);
  const [token, setToken] = useState(null);
  const [remTime, setRemTime] = useState(0);
  const [status, setStatus] = useState('IDLE');
  const [testrun, setTestrun] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [testDone, setTestDone] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [pairingCode, setPairingCode] = useState(null);
  const [settings, setSettings] = useState(window.api.getConfig());
  const [submitFilter, setSubmitFilter] = useState(false);
  const [resultsSubmitted, setSubmitted] = useState(false);
  const [barcodes, setBarcodes] = useState(defaultBarcodes(settings));
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [resultList, setResultList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNinetySix, setIsNinetySix] = useState(settings?.device?.wellCount === 96);
  const [paramTrans, setParamTrans] = useState({ CY5: 'POC_HEC', ROX: 'POC_VIRUS' });
  const [isStatus, setIsStatus] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState('IDLE');
  const [USBPresent, setUSBPresent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reading, setReading] = useState(true);
  const [results, setResults] = useState([]);
  const [viewResults, setViewResults] = useState('graph');
  const [dbConnection, setDbConnection] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [openResults, setOpenResults] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isLidOpen, setIsLidOpen] = useState(false);
  const [idleTimestamp, setIdleTimestamp] = useState(null);
  const [checkForTestResultFile, setCheckForTestResultFile] = useState(false);
  const { t } = useTranslation();
  /**
   * Resets values to default
   * @returns {void}
   **/
  const reset = () => {
    setIsStatus(false);
    setBarcodes(defaultBarcodes(settings));
    setRemTime(0);
    setTestrun(false);
    setErrors([]);
    setTestDone(null);
    setSubmitted(false);
    setTestid('');
    setTestDone(null);
    setSelectedMethod(null);
    setDeviceStatus('IDLE');
  };

  const resetBarcodes = () => {
    setBarcodes(defaultBarcodes(settings));
  };

  const handleError = (type, message) => {
    if (!message) {
    }

    setErrors((prevErrors) => prevErrors.filter((error) => error.type !== type).concat({ type, message }));
  };

  /**
   * Sets the value of the data state
   **/
  const loadSettings = async () => {
    let newSettings = await window.api.getConfig();
    setSettings(newSettings);
    console.log('settings loaded:');

    window.api.logEvents(`Settings loaded: ${JSON.stringify(newSettings)}`, 'logInfos.txt');
    setIsStatus(true);
    return newSettings;
  };

  useEffect(() => {
    setBarcodes(defaultBarcodes(settings));
  }, [settings.account.autoControl]);

  const handleSettingChange = useCallback(
    async (key, value) => {
      await saveSettings({ ...settings, [key]: value });
    },
    [settings, setSettings]
  );
  const handleSettings = useCallback(
    (newSettings) => {
      setSettings(newSettings);
    },
    [settings, setSettings]
  );

  const handleErrors = useCallback(
    (payload) => {
      if (JSON.stringify(payload) !== JSON.stringify(errors)) {
        setErrors(payload);
      }
    },
    [errors, setErrors]
  );

  const toggleDemo = () => {
    if (demo) {
      setDemo(false);
    } else {
      setDemo(true);
    }
  };

  const shutdown = () => {
    window.api.power();
  };

  const reboot = () => {
    window.api.power('reboot');
  };

  const exit = () => {
    window.api.exit();
  };

  const clearSettings = async () => {
    let newErrors = errors.filter((error) => error.type !== 'settings');
    let response = true;
    const clear = await window.api.clearConfig();
    await window.api.archiveRun();
    setIsStatus(false);
    if (!clear) {
      newErrors.push({
        type: 'settings',
        message: t('default.errors.failedTosaveSettings'),
      });
      response = false;
    } else {
      let newSettings = await window.api.getConfig();
      setSettings(newSettings);
    }
    setErrors(newErrors);
    return response;
  };

  const saveSettings = useCallback(
    async (settings) => {
      try {
        await window.api.saveConfig(settings);
        setSettings({
          ...settings,
          user: { ...settings.user, ntcPos: settings?.device?.wellCount === '96' ? 'B01' : 'A02' },
        });
        setIsNinetySix(settings?.device?.wellCount === '96');
        return true;
      } catch (error) {
        console.log(error);
        setErrors((prevErrors) =>
          prevErrors
            .filter((error) => error.type !== 'saveSettings')
            .concat({
              type: 'saveSettings',
              message: t('default.errors.failedTosaveSettings'),
            })
        );
        return false;
      }
    },
    [settings?.device?.wellCount, errors, isNinetySix, barcodes]
  );

  const openLid = () => {
    let newErrors = errors.filter((error) => error.type !== 'lid');
    if (status === 'RUNNING') {
      setIsLidOpen(false);
    }
    if (isNinetySix) {
      // Try to open the lid
      if (!window.api.openLid()) {
        // If the lid fails to open, push a new 'lid' error into newErrors
        newErrors.push({
          type: 'lid',
          message: t('default.errors.errorOpenLid'),
        });
      } else {
        setIsLidOpen(!isLidOpen);
      }
    } else {
      if (!window.api.openLid()) {
        newErrors.push({
          type: 'lid',
          message: t('default.errors.errorCloseLid'),
        });
      } else {
        setIsLidOpen(true);
      }
    }

    setErrors(newErrors);
  };

  const handleOpenEdit = useCallback(
    (barcode) => {
      setOpenResults(true);
      setSelectedPosition(barcode.posName);
    },
    [openResults, selectedPosition]
  );

  const deleteAllOverrides = useCallback(async () => {
    await window.api.deleteAllOverrides();
  }, []);

  const deleteOverride = useCallback(async (testid) => {
    await window.api.deleteOverride(testid);
  }, []);

  useEffect(() => {
    loadSettings();
  }, []);

  const contextValue = useMemo(
    () => ({
      openResults,
      setOpenResults,
      user,
      errors,
      handleErrors,
      demo,
      settings,
      resultList,
      toggleDemo,
      shutdown,
      reboot,
      exit,
      clearSettings,
      saveSettings,
      openLid,
      setErrors,
      setDemo,
      setSettings,
      setResultList,
      setUser,
      barcodes,
      setBarcodes,
      remTime,
      setRemTime,
      testrun,
      setTestrun,
      testid,
      setTestid,
      testDone,
      setTestDone,
      pairingCode,
      setPairingCode,
      token,
      setToken,
      resultsSubmitted,
      setSubmitted,
      reset,
      resetBarcodes,
      loadSettings,
      setSubmitFilter,
      submitFilter,
      updateAvailable,
      setUpdateAvailable,
      currentUser,
      setCurrentUser,
      status,
      setStatus,
      menuOpen,
      setMenuOpen,
      loading,
      setLoading,
      isModal,
      setIsModal,
      setIsNinetySix,
      isNinetySix,
      paramTrans,
      setParamTrans,
      handleSettingChange,
      handleSettings,
      isStatus,
      setIsStatus,
      selectedMethod,
      setSelectedMethod,
      deviceStatus,
      setDeviceStatus,
      USBPresent,
      setUSBPresent,
      results,
      setResults,
      reading,
      setReading,
      submitting,
      setSubmitting,
      viewResults,
      setViewResults,
      dbConnection,
      setDbConnection,
      offlineMode,
      setOfflineMode,
      isLidOpen,
      setIsLidOpen,
      selectedPosition,
      setSelectedPosition,
      handleOpenEdit,
      handleError,
      idleTimestamp,
      setIdleTimestamp,
      checkForTestResultFile,
      setCheckForTestResultFile,
    }),
    [
      openResults,
      setOpenResults,
      user,
      errors,
      handleErrors,
      demo,
      settings,
      resultList,
      toggleDemo,
      shutdown,
      reboot,
      exit,
      clearSettings,
      saveSettings,
      openLid,
      setErrors,
      setDemo,
      setSettings,
      setResultList,
      setUser,
      barcodes,
      setBarcodes,
      remTime,
      setRemTime,
      testrun,
      setTestrun,
      testid,
      setTestid,
      testDone,
      setTestDone,
      pairingCode,
      setPairingCode,
      token,
      setToken,
      resultsSubmitted,
      setSubmitted,
      reset,
      resetBarcodes,
      loadSettings,
      setSubmitFilter,
      submitFilter,
      updateAvailable,
      setUpdateAvailable,
      currentUser,
      setCurrentUser,
      status,
      setStatus,
      menuOpen,
      setMenuOpen,
      loading,
      setLoading,
      isModal,
      setIsModal,
      setIsNinetySix,
      isNinetySix,
      paramTrans,
      setParamTrans,
      handleSettingChange,
      handleSettings,
      isStatus,
      setIsStatus,
      selectedMethod,
      setSelectedMethod,
      deviceStatus,
      setDeviceStatus,
      USBPresent,
      setUSBPresent,
      results,
      setResults,
      reading,
      setReading,
      submitting,
      setSubmitting,
      viewResults,
      setViewResults,
      dbConnection,
      setDbConnection,
      offlineMode,
      setOfflineMode,
      isLidOpen,
      setIsLidOpen,
      selectedPosition,
      setSelectedPosition,
      handleOpenEdit,
      handleError,
      idleTimestamp,
      setIdleTimestamp,
      checkForTestResultFile,
      setCheckForTestResultFile,
    ]
  );
  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
}
/**
 *  hook to access the data context
 * @returns {Object} The current context
 */
export const useData = () => useContext(DataContext);
