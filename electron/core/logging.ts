import { ipcMain } from "electron";
import { logger } from "../logger";

export function logError(): void {
  // logic for logging errors
  /**
   * Log Errors or Infos
   * */
  ipcMain.handle("log-Events", (event, message) => logger(message));
}
