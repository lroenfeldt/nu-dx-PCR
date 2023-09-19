import { ipcMain } from "electron";
import isDev from "electron-is-dev";
import * as fs from "fs";
import * as path from "path";
import { getDeviceType } from "../main";
import { logger } from "../logger";
import shutdown from "electron-shutdown-command";
import macaddress from "macaddress";
const SerialPort = require("serialport");

const SERIAL_PORT_PATH = "COM1";
const SERIAL_PORT_OPTIONS = {
	path: SERIAL_PORT_PATH,
	baudRate: 19200,
	parity: "none",
	autoOpen: false,
};

export function rebootDevice(): void {
	ipcMain.on("power", (event, reboot) => {
		if (reboot === "reboot") {
			shutdown.reboot({ force: true });
		} else {
			shutdown.shutdown({ force: true });
		}
		event.returnValue = true;
	});
}

export function toggleLid() {
	ipcMain.handle("toggleLid", (event: Electron.IpcMainInvokeEvent): boolean => {
		logger("Signal to toggle lid received.", "logErrors");

		if (isDev) {
			return true;
		}

		const buffer: number[] = [0x7b, 0x7c, 0x0, 0x2, 0x4d, 0x1, 0x0, 0x4c, 0x7c, 0x7d];
		let serialport = new SerialPort(SERIAL_PORT_OPTIONS);

		serialport.open((err?: Error | null) => {
			if (err) {
				handleSerialPortError(err, "establishing");
				return false;
			}

			serialport.write(buffer, (err?: Error | null, result?: number) => {
				if (err) {
					handleSerialPortError(err, "opening lid");
					return false;
				}

				if (result) {
					console.log("Response received after opening lid : " + result);
				}

				serialport.close((err?: Error | null) => {
					if (err) {
						handleSerialPortError(err, "closing");
						return false;
					}
				});
			});
		});

		return true;
	});
}

function handleSerialPortError(err: Error, operation: string) {
	const errorMessage = `Error ${operation} serialport connection : ${err.message}`;
	console.log(errorMessage);
	logger(errorMessage, "logErrors");
}

export function checkUSB() {
	ipcMain.handle("checkUSB", (_event) => {
		if (isDev) {
			return true;
		}

		try {
			fs.accessSync("D:\\", fs.constants.F_OK);
			return true;
		} catch (err) {
			const errorMessage = "No Drive found or Drive not accessible";
			console.log(errorMessage);
			logger(errorMessage, "logInfos");
			return false;
		}
	});
}

export function saveToUSB() {

	ipcMain.handle("saveToUSB", (event, testid, results) => {
		console.log(results);
		logger(JSON.stringify(results), "logInfos");
		const filename = testid + ".csv";
		const destPath = "D:\\nu-dx-pcr\\runs";
		const filepath = path.resolve(destPath, filename);
		try {
			fs.mkdirSync(path.dirname(filepath), { recursive: true });
			fs.writeFileSync(filepath, results);
		} catch (err: any) {
			console.log(err);
			logger(err, "logErrors");
			logger(`saveToUSB: ${err}`, "logErrors");
			throw err;
		}
		return true;
	});
}

export function getDeviceInfo() {
	/**
	 * Get Device Infos
	 * @returns {object}  { hardwareId, deviceType, serialNumber }
	 * */
	ipcMain.handle("getDeviceInfo", async (event) => {
		try {
			let hardwareId = await macaddress.one().then((mac) => mac);
			let serialNumber = ""; //await getSerialNumber();
			let deviceType = getDeviceType();
			return { hardwareId, deviceType, serialNumber };
		} catch (err: any) {
			console.log(err);
			logger(err, "logErrors");
			logger(`getDeviceInfo: ${err}`, "logErrors");
			throw err;
		}
	});
}
