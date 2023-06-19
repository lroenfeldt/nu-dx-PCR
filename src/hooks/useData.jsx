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
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [demo, setDemo] = useState(false);
  const [errors, setErrors] = useState([]);
  const [token, setToken] = useState(null);
  const [remTime, setRemTime] = useState(0);
  const [testid, setTestid] = useState(null);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('IDLE');
  const [reading, setReading] = useState(true);
  const [testrun, setTestrun] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [testDone, setTestDone] = useState(null);
  const [lotNumber, setLotNumber] = useState('');
  const [isStatus, setIsStatus] = useState(false);
  const [resultList, setResultList] = useState([]);
  const [isLidOpen, setIsLidOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [USBPresent, setUSBPresent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pairingCode, setPairingCode] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [openResults, setOpenResults] = useState(false);
  const [dbConnection, setDbConnection] = useState(true);
  const [submitFilter, setSubmitFilter] = useState(false);
  const [viewResults, setViewResults] = useState('graph');
  const [resultsSubmitted, setSubmitted] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState('IDLE');
  const [idleTimestamp, setIdleTimestamp] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [settings, setSettings] = useState(window.api.getConfig());
  const [barcodes, setBarcodes] = useState(defaultBarcodes(settings));
  const [checkForTestResultFile, setCheckForTestResultFile] = useState(false);
  const [isNinetySix, setIsNinetySix] = useState(settings?.device?.wellCount === 96);
  const [paramTrans, setParamTrans] = useState({ CY5: 'POC_HEC', ROX: 'POC_VIRUS' });
  /**
   * Resets values to default
   * @returns {void}
   **/
  const reset = useCallback(() => {
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
  }, [settings]);

  const resetBarcodes = useCallback(() => {
    setBarcodes(defaultBarcodes(settings));
  }, [settings]);

  const handleError = useCallback((type, message) => {
    if (!message) {
    }

    setErrors((prevErrors) => prevErrors.filter((error) => error.type !== type).concat({ type, message }));
  }, []);

  /**
   * Sets the value of the data state
   **/
  const loadSettings = useCallback(async () => {
    let newSettings = await window.api.getConfig();
    setSettings(newSettings);
    console.log('settings loaded:');

    window.api.logEvents(`Settings loaded: ${JSON.stringify(newSettings)}`, 'logInfos.txt');
    setIsStatus(true);
    return newSettings;
  }, []);

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

  const toggleDemo = useCallback(() => {
    setDemo(!demo);
  }, [demo]);

  const shutdown = useCallback(() => {
    window.api.power();
  }, []);

  const reboot = useCallback(() => {
    window.api.power('reboot');
  }, []);

  const exit = useCallback(() => {
    window.api.exit();
  }, []);

  const clearSettings = useCallback(async () => {
    let newErrors = errors.filter((error) => error.type !== 'settings');
    let response = true;
    const clear = await window.api.clearConfig();
    await window.api.archiveRun();
    setIsStatus(false);
    if (!clear) {
      newErrors.push({
        type: 'settings',
        message: t('errors.failedTosaveSettings'),
      });
      response = false;
    } else {
      let newSettings = await window.api.getConfig();
      setSettings(newSettings);
    }
    setErrors(newErrors);
    return response;
  }, [errors, setErrors, setSettings]);

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
              message: t('errors.failedTosaveSettings'),
            })
        );
        return false;
      }
    },
    [settings?.device?.wellCount, errors, isNinetySix, barcodes]
  );

  const toggleLid = useCallback(() => {
    let newErrors = errors.filter((error) => error.type !== 'lid');
    if (status == 'RUNNING') {
      newErrors.push({
        type: 'default',
        message: t('default.errors.errorOpenLidWhileRunning'),
      });
      return;
    }
    if (window.api.toggleLid()) {
      setIsLidOpen(!isNinetySix ? true : !isLidOpen);
    } else {
      let errorType = !isNinetySix ? 'errorOpenLid' : isLidOpen ? 'errorCloseLid' : 'errorOpenLid';
      newErrors.push({
        type: 'lid',
        message: t(`default.errors.${errorType}`),
      });
    }

    setErrors(newErrors);
  }, [status, isNinetySix, isLidOpen, errors]);

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
      toggleLid,
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
      lotNumber,
      setLotNumber,
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
      toggleLid,
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
      lotNumber,
      setLotNumber,
    ]
  );
  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
}
/**
 *  hook to access the data context
 * @returns {Object} The current context
 */
export const useData = () => useContext(DataContext);
