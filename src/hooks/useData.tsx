import React, { useCallback, useContext, useEffect, useState, useMemo } from "react";
import defaultBarcodes from "../utils/defaultBarcodes";
import { useTranslation } from "./useTranslation";
import { ISettings, IUseData } from "../types/interfaces/useData";
import { IUseTranslation } from "../types/interfaces/useTranslation";
import { IBarcode, IError } from "../types/interfaces/interfaces";
import { ITestObject } from "../../electron/interfaces/interfaces";


export const DataContext = React.createContext({});
/**
 * Provides a stateful value for data and a function to update it.
 * @param {object} children
 * @returns {object} data, setData
 * @example const { data, setData } = useData();
 * */

interface DataProviderProps {
	children: JSX.Element;
}

export function DataProvider({ children }: DataProviderProps) {
	const { t }: IUseTranslation = useTranslation();
	const [demo, setDemo] = useState(false);
	const [errors, setErrors] = useState<IError[]>([]);
	const [remTime, setRemTime] = useState(0);
	const [testid, setTestid] = useState<string>("");
	const [results, setResults] = useState<ITestObject[]>([]);
	const [reading, setReading] = useState(true);
	const [testrun, setTestrun] = useState(false);
	const [isModal, setIsModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [menuOpen, setMenuOpen] = useState(null);
	const [testDone, setTestDone] = useState(false);
	const [lotNumber, setLotNumber] = useState(null);
	const [isStatus, setIsStatus] = useState(true);
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
	const [viewResults, setViewResults] = useState("graph");
	const [resultsSubmitted, setSubmitted] = useState(false);
	const [deviceStatus, setDeviceStatus] = useState("IDLE");
	const [idleTimestamp, setIdleTimestamp] = useState(null);
	const [selectedMethod, setSelectedMethod] = useState("");
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [selectedPosition, setSelectedPosition] = useState("");
	const [settings, setSettings] = useState(window.api.getConfig());
	const [barcodes, setBarcodes] = useState<IBarcode[]>(defaultBarcodes(settings));
	const [checkForTestResultFile, setCheckForTestResultFile] = useState(false);
	const [updateType, setUpdateType] = useState(settings.user.updateType || "stable");
	const [isNinetySix, setIsNinetySix] = useState(settings?.device?.wellCount === 96);
	const [paramTrans, setParamTrans] = useState({ CY5: "POC_HEC", ROX: "POC_VIRUS" });
	const [isResultFilePresent, setIsResultFilePresent] = useState(false);
	const [failedSubmittingResults, setFailedSubmittingResults] = useState<string[]>([]);
	/**
	 * Resets values to default
	 * @returns {void}
	 **/
	const reset = useCallback(() => {
		setRemTime(0);
		setErrors([]);
		setTestid("");
		setTestrun(false);
		setTestDone(false);
		setSubmitted(false);
		setSelectedMethod("");
		setDeviceStatus("IDLE");
		setBarcodes(defaultBarcodes(settings));
	}, [settings]);

	const resetBarcodes = useCallback(() => {
		setBarcodes(defaultBarcodes(settings));
	}, [settings]);

	const handleError = useCallback((type: string, message: string) => {
		if (!message) {
		}

		setErrors((prevErrors) => prevErrors.filter((error) => error.type !== type).concat({ type, message }));
	}, []);

	/**
	 * Sets the value of the data state
	 **/
	const loadSettings = useCallback(async () => {
		window.api.copyLogos();
		setIsStatus(false);
		let newSettings = await window.api.getConfig();
		setSettings(newSettings);
		console.log("settings loaded:");

		window.api.logEvents(`Settings loaded: ${JSON.stringify(newSettings)}`, "logInfos.txt");
		setIsStatus(true);
		return newSettings;
	}, []);

	useEffect(() => {
		setBarcodes(defaultBarcodes(settings));
	}, [settings.account.autoControl]);

	const handleSettingChange = useCallback(
		async (key: string, value: string) => {
			await saveSettings({ ...settings, [key]: value });
		},
		[settings, setSettings]
	);
	const handleSettings = useCallback(
		(newSettings: ISettings) => {
			setSettings(newSettings);
		},
		[settings, setSettings]
	);

	const handleErrors = useCallback(
		(payload: IError[]) => {
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
		window.api.power("shutdown");
	}, []);

	const reboot = useCallback(() => {
		window.api.power("reboot");
	}, []);

	const exit = useCallback(() => {
		window.api.exit();
	}, []);

	const clearSettings = useCallback(async () => {
		let newErrors = errors.filter((error) => error.type !== "settings");
		let response = true;
		const clear = await window.api.clearConfig();
		await window.api.archiveRun();
		setIsStatus(false);
		if (!clear) {
			newErrors.push({
				type: "settings",
				message: t("errors.failedTosaveSettings"),
			});
			response = false;
		} else {
			let newSettings = await window.api.getConfig();
			setSettings({
				...newSettings,
				user: { ...newSettings.user, ntcPos: newSettings?.device?.wellCount === 96 ? "B01" : "A02" },
			});
		}
		setErrors(newErrors);
		setIsStatus(true);
		return response;
	}, [errors, settings, isStatus]);

	const saveSettings = useCallback(
		async (settings: ISettings) => {
			try {
				await window.api.saveConfig(settings);
				setSettings({
					...settings,
					user: { ...settings.user, ntcPos: settings?.device?.wellCount === 96 ? "B01" : "A02" },
				});
				setIsNinetySix(settings?.device?.wellCount === 96);
				return true;
			} catch (error) {
				console.log(error);
				setErrors((prevErrors) =>
					prevErrors
						.filter((error) => error.type !== "saveSettings")
						.concat({
							type: "saveSettings",
							message: t("errors.failedTosaveSettings"),
						})
				);
				return false;
			}
		},
		[settings, errors, isNinetySix, barcodes]
	);

	const toggleLid = useCallback(() => {

		let newErrors = errors.filter((error) => error.type !== "lid");
		if (deviceStatus == "RUNNING") {
			newErrors.push({
				type: "default",
				message: t("default.errors.errorOpenLidWhileRunning"),
			});
			return;
		}
		if (window.api.toggleLid()) {
			
			setIsLidOpen(!isNinetySix ? true : !isLidOpen);
			
		} else {
			
			let errorType = !isNinetySix ? "errorOpenLid" : isLidOpen ? "errorCloseLid" : "errorOpenLid";
			newErrors.push({
				type: "lid",
				message: t(`default.errors.${errorType}`),
			});
			
		}

		setErrors(newErrors);
	}, [deviceStatus, isNinetySix, isLidOpen, errors]);

	const handleOpenEdit = useCallback(
		(barcode: IBarcode) => {
			// The `React.SetStateAction` type is a generic type that is provided by the React library.
			// It represents a function that can be used to update the state of a React component.
			// In this case, it is being used to update the value of `barcode.posName`.
			setOpenResults(true);
			setSelectedPosition(barcode.posName);
		},
		[openResults, selectedPosition]
	);

	useEffect(() => {
		loadSettings();
	}, []);

	const contextValue = useMemo(
		() => ({
			openResults,
			setOpenResults,

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
			updateType,
			setUpdateType,
			isResultFilePresent,
			setIsResultFilePresent,
			failedSubmittingResults,
			setFailedSubmittingResults,
		}),
		[
			openResults,
			setOpenResults,
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
			updateType,
			setUpdateType,
			isResultFilePresent,
			setIsResultFilePresent,
			failedSubmittingResults,
			setFailedSubmittingResults,
		]
	);
	return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
}
/**
 *  hook to access the data context
 * @returns {Object} The current context
 */
export const useData = () => useContext(DataContext) as IUseData;
