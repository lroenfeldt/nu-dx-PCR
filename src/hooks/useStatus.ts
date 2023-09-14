import { useCallback } from "react";
import { useApi, useData } from "./";
import onlineStatus from "../api/onlineStatus";
import { ISettings } from "../types/interfaces/settings";

type SettingsType = {
  device: {
    hardwareId: string;
  };
  version: string;
  account: {
    authToken: string;
    initialized: boolean;
  };
};

interface UseStatusReturnType {
  ping: () => Promise<void>;
}

interface IResponse {
  ok: boolean;
  data: ISettings;
  problem: string;
}

export const useStatus = (): UseStatusReturnType => {
  const onlineStatusApi = useApi(onlineStatus.postStatus);
  const {
    saveSettings,
    settings,
    deviceStatus,
    setErrors,
    setDbConnection,
    isStatus,
  } = useData();

  const ping = useCallback(async () => {
    try {
      const response = await onlineStatusApi.request(
        settings.device.hardwareId,
        {
          status: deviceStatus,
          timesStamp: new Date().getTime(),
          cyclerVersion: settings.version,
        }
      );
      const responseData = response.data as IResponse;

      if (responseData.ok && responseData.data.account) {
        let newSettings: SettingsType = {
          ...settings,
          account: {
            ...responseData.data.account,
            authToken: settings.account.authToken,
            initialized: settings.account.authToken !== "" ? true : false,
          },
        };

        await saveSettings(newSettings);
      }

      if (
        response.problem === "NETWORK_ERROR" ||
        response.problem === "CONNECTION_ERROR"
      ) {
        setDbConnection(false);
      } else {
        setDbConnection(true);
        setErrors((errors: any[]) =>
          errors.filter((error: any) => error.type !== "stillOffline")
        );
      }

      window.api.logEvents(
        `ping status response: ${JSON.stringify(response)}`,
        "logInfos"
      );
    } catch (err: any) {
      console.log(err);
      window.api.logEvents("ping status error:" + err, "logErrors");
    }
  }, [deviceStatus, settings, onlineStatusApi, isStatus]);

  return { ping };
};
