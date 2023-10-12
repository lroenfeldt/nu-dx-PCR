import { useCallback } from "react";
// Placeholder imports; you need to import actual types from your project.
import { useApi, useData } from "./";
import onlineStatus from "../api/onlineStatus";

// Placeholder type definitions. Replace with your actual types.
type SettingsType = {
  device: {
    hardwareId: string;
  };
  version: string;
  account: {
    authToken: string;
  };
};

type ResponseType = {
  ok: boolean;
  data: {
    account: any; // Replace 'any' with the actual type of account.
  };
  problem?: "NETWORK_ERROR" | "CONNECTION_ERROR" | string;
};

interface UseStatusReturnType {
  ping: () => Promise<void>;
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
      const response: ResponseType = await onlineStatusApi.request(
        settings.device.hardwareId,
        {
          status: deviceStatus,
          timesStamp: new Date().getTime(),
          cyclerVersion: settings.version,
        }
      );

      if (response.ok && response.data.account) {
        let newSettings: SettingsType = {
          ...settings,
          account: {
            ...response.data.account,
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

      window.api.logEvents(`ping status response: ${JSON.stringify(response)}`);
    } catch (err: any) {
      console.log(err);
      window.api.logEvents("ping status error:" + err);
    }
  }, [deviceStatus, settings, onlineStatusApi, isStatus]);

  return { ping };
};
