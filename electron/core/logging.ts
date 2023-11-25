import { ipcMain } from "electron";
import { logger } from "./logs/logger";

export function logError(): void {
  /**
   * Log Errors or Infos
   * */
  ipcMain.handle("log-Events", (_event, message) => logger(message));
}

export function logInfo(): void {
  // logic for logging general info
}
