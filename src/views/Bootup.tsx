import { useCallback, useEffect } from "react";
import auth from "../api/auth";
import jwt_decode from "jwt-decode";
import { Oval } from "react-loader-spinner";
import pairingApi from "../api/pairingCode";
import { useNavigate } from "react-router-dom";
import { useData, useApi, useTranslation } from "../hooks";

const Bootup = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { settings, setErrors, errors, setLoading, setSettings, pairingCode, saveSettings, clearSettings, setPairingCode } = useData();
	const getPairingCodeApi = useApi<any>(pairingApi.pollPairingCode);

	/**
	 * @description Get pairing code from server
	 */
	const getPairingCode = useCallback(async () => {
		setLoading(true);
		setErrors(errors.filter((error) => error.type !== "pairing"));

		if (settings.device.hardwareId === null) {
			window.api.logEvents("Couldnt read MAC Adress from Settings.", "logInfos");
			setErrors(
				errors

					.filter((error) => error.type !== "pairing")
					.concat({
						type: "pairing",
						message: t("errors.checkInternetConnection"),
					})
			);
		} else {
			try {
				window.api.logEvents("trying to fetch pairing code", "logInfos");

				let response = await getPairingCodeApi.request(settings.device.hardwareId, {
					deviceType: settings.device.wellCount,
				});

				setLoading(false);
				if (response.ok) {
					if (settings.isDev) {
						setTimeout(() => {
							navigate("/pairing");
						}, 3000);
					} else {
						navigate("/pairing");
					}
				}

				setPairingCode(response?.data?.code);
				if (response.problem == "NETWORK_ERROR" || response?.problem == "CONNECTION_ERROR") {
					setErrors(
						errors

							.filter((error) => error.type !== "pairing")
							.concat({
								type: "pairing",
								message: t("errors.pairingDbError"),
							})
					);
				}

				window.api.logEvents(`getPairingCodeApi: ${JSON.stringify(response)}`, "logInfos");
				window.api.logEvents(`PairingCodeApi: ${JSON.stringify(response?.data?.code)}`, "logInfos");
			} catch (err: any) {
				console.error(err);
				setLoading(false);
				if (err.response) {
					console.error(err.response?.data);
					window.api.logEvents(
						`headers:${JSON.stringify(err.response.headers)} status:${JSON.stringify(err.response.status)}  data:${JSON.stringify(
							err.response?.data
						)} `,
						"logErrors"
					);
					setErrors(
						errors
							.filter((error) => error.type !== "pairing")
							.concat({
								type: "pairing",
								message: t("errors.deviceRegistrationFailed"),
							})
					);
				} else if (err.request) {
					console.error(err.request);
					window.api.logEvents(`request:${err}`, "logErrors");
					setErrors(
						errors

							.filter((error) => error.type !== "pairing")
							.concat({
								type: "pairing",
								message: t("errors.pairingDbError"),
							})
					);
				} else {
					console.error("Error", err.message);
					window.api.logEvents(`Error:${JSON.stringify(err.message)}`, "logErrors");
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
		}
	}, [pairingCode, settings]);

	const checkTokenApi = useApi(auth.checkToken);
	/**
	 * @description Check if token is valid and get user data
	 **/
	const authenticateToken = useCallback(async () => {
		setLoading(false);
		const token = settings.account.authToken;

		const decoded: { exp: number } = jwt_decode(token);
		let difference = decoded.exp * 1000 - Date.now();

		const remDays = Math.floor(difference / 1000 / 60 / 60 / 24);
		if (remDays < 0 && settings.account.allowDaysOffline != 0) {
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
			if (settings.isDev) {
				setTimeout(() => {
					navigate("/pairing");
				}, 3000);
			} else {
				navigate("/pairing");
			}
			setLoading(false);
		}
		try {
			let response: any = await checkTokenApi.request(settings.device.hardwareId, {
				token,
			});

			window.api.logEvents(` authenticateToken response :${JSON.stringify(response)}`, "logInfos");
			setLoading(false);
			if (response.ok) {
				if (response.data.account) {
					let newSettings = settings;
					newSettings.account = response?.data.account;
					newSettings.account.initialized = true;
					await saveSettings(newSettings);
					navigate("/selectMethod");
				} else {
					await clearSettings();
				}
			}
			if ((response?.data?.error == "Invalid Token" && response?.data?.valid == false) || response?.data?.error == "Could not find device") {
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
				if (settings.isDev) {
					setTimeout(() => {
						navigate("/pairing");
					}, 3000);
				} else {
					navigate("/pairing");
				}
				setLoading(false);
			}
			if (response?.problem && response?.problem == "CLIENT_ERROR") {
				console.error("Error", response.originalError.message);
				window.api.logEvents(`Error:${JSON.stringify(response.originalError.message)}`, "logErrors");
				setErrors(
					errors

						.filter((error) => error.type !== "auth")
						.concat({
							type: "auth",
							message: t("errors.pairingFailed", {
								message: response.originalError.message,
							}),
						})
				);
			}
			if ((response?.problem && response?.problem == "NETWORK_ERROR") || response?.problem == "CONNECTION_ERROR") {
				window.api.logEvents(`request:${JSON.stringify(response)}`, "logErrors");
				if (settings.account.allowOffline) {
					if (settings.account.allowDaysOffline == 0) {
						setErrors(
							errors

								.filter((error) => error.type !== "offlineNotAllow")
								.concat({
									type: "offlineNotAllow",
									message: t("errors.checkInternetConnection"),
								})
						);
					} else if (remDays > 0 && settings.account.allowDaysOffline != 0) {
						setErrors(
							errors

								.filter((error) => error.type !== "init")
								.filter((error) => error.type !== "offline")
								.concat({
									type: "offline",
									message: t("errors.deviceAuthenticationFailedUseOfflineMode", {
										days: remDays,
									}),
								})
						);
					} else if (remDays === 0 && settings.account.allowDaysOffline != 0) {
						setErrors(
							errors

								.filter((error) => error.type !== "offline")
								.concat({
									type: "offline",
									message: t("errors.deviceAuthenticationFailedZeroRemDays"),
								})
						);
					} else {
						setErrors(
							errors

								.filter((error) => error.type !== "auth")
								.concat({
									type: "auth",
									message: t("errors.deviceAuthenticationFailedRetry"),
								})
						);
					}
				} else {
					setErrors(
						errors

							.filter((error) => error.type !== "offlineNotAllow")
							.concat({
								type: "offlineNotAllow",
								message: t("errors.checkInternetConnection"),
							})
					);
				}
			}
		} catch (err: any) {
			console.error(err);
			setLoading(false);
			if (err?.response) {
				console.error("token invalid");
				window.api.logEvents(
					`headers:${JSON.stringify(err.response.headers)} status:${JSON.stringify(err.response.status)}  data:${JSON.stringify(
						err.response?.data
					)} `,
					"logErrors"
				);
				await clearSettings();
				await getPairingCode();
			} else {
				console.error("Error", err.message);
				window.api.logEvents(`Error:${JSON.stringify(err.message)}`, "logErrors");
				setErrors(
					errors

						.filter((error) => error.type !== "auth")
						.concat({
							type: "auth",
							message: t("errors.pairingFailed", {
								message: err.message,
							}),
						})
				);
			}
		}
	}, [settings.account.authToken, setSettings]);

	useEffect(() => {
		if (settings.account.initialized) {
			authenticateToken();

			window.api.logEvents("initialized, attempting authentication", "logInfos");
		} else {
			getPairingCode();
		}
		if (!settings.device.wellCount) {
			setErrors(
				errors

					.filter((error) => error.type !== "init")
					.concat({
						type: "init",
						message: t("errors.deviceInitializationFailed"),
					})
			);
		}
	}, [settings]);

	return (
		<div className="Bootup">
			<div className="spinnerContainer">
				<Oval height="100" width="100" color="var(--primary)" />
			</div>
			<h2>{t("bootup.deviceStart")}</h2>
		</div>
	);
};

export default Bootup;
