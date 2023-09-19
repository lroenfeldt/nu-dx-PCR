import { spawn } from "child_process";
import { app, ipcMain } from "electron";

export function exit() {
  /**
   * Exit App
   * */
  ipcMain.handle("exit", (event) => {
    spawn("taskkill", ["/f", "/im", "LineGene1600.exe"]);
    spawn("taskkill", ["/f", "/im", "Gene-9660.exe"]);
    spawn("taskkill", ["/f", "/im", "PcrServer.exe"]);
    app.quit();
  });
}

export function relaunchApp() {
  /**
   * relaunch app
   * @returns {void}
   * */
  ipcMain.handle("relaunchApp", async (event) => {
   
    app.relaunch();
    app.exit();
  });
}
