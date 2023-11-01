import { ISettings } from "./../types/interfaces/settings";
import { useCallback, useState } from "react";
import { useApi, useData } from "./";
import onlineStatus from "../api/onlineStatus";
import { UseStatusReturnType } from "../types/interfaces/useStatuts";

export const useStatus = (): UseStatusReturnType => {
  const onlineStatusApi = useApi(onlineStatus.postStatus);
  const {
    saveSettings,
    settings,
    deviceStatus,
    setErrors,
    setDbConnection,
    isStatus,
    errors,
    testid,
    testFinishedAt,
  } = useData();

  const ping = useCallback(async () => {
    try {
      const response = await onlineStatusApi.request(
        settings.device.hardwareId,
        {
          status: deviceStatus,
          timesStamp: new Date().getTime(),
          cyclerVersion: settings.version,
        },
        errors,
        testid,
        testFinishedAt
      );
      const responseData = response.data as ISettings;
      if (response.ok) {
        let newSettings = {
          ...settings,
          account: {
            ...responseData.account,
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
      console.error(err);
      window.api.logEvents("ping status error:" + err);
    }
  }, [
    deviceStatus,
    settings,
    onlineStatusApi,
    isStatus,
    errors,
    testid,
    testFinishedAt,
  ]);

  return { ping };
};
