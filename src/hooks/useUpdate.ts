import { useCallback } from "react";
import axios from "axios";
import { useData } from "./useData";

const useUpdate = () => {
  const { settings, setUpdateAvailable } = useData();

  const getLastVersion = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_APP_GH_TOKEN}`,
        },
      };
      const response = await axios.get(
        "https://api.github.com/repos/lroenfeldt/nu-dx-pcr/releases",
        config
      );
      let latestVersion;

      if (settings.user.updateType === "beta") {
        // Filter prereleases and pick the first one as the latest beta version
        latestVersion = response.data.filter(
          (release: { prerelease: boolean }) => release.prerelease
        )[0];
      } else if (settings.user.updateType === "stable") {
        // Otherwise pick the first release as the latest stable version
        latestVersion = response.data.filter(
          (release: { prerelease: boolean }) => !release.prerelease
        )[0];
      }

      if (settings.version && latestVersion) {
        const currentVersion = settings.version.split(".");
        const newVersion = latestVersion.tag_name.replace("v", "").split(".");
        for (let i = 0; i < currentVersion.length; i++) {
          if (
            parseInt(currentVersion[i]) !== parseInt(newVersion[i]) &&
            parseInt(newVersion[i]) > parseInt(currentVersion[i])
          ) {
            setUpdateAvailable(true);
            break;
          } else if (parseInt(newVersion[i]) < parseInt(currentVersion[i])) {
            setUpdateAvailable(false);
            break;
          }
        }
      }

      if (latestVersion) {
        window.api.logEvents(
          `currentVersion: ${settings.version}, newVersion:${latestVersion.tag_name}`,
          "logInfos"
        );
      } else {
        window.api.logEvents(`No new version found`, "logInfos");
      }
    } catch (err) {
      console.error(err);
      window.api.logEvents("getLastVersion error" + err, "logErrors");
    }
  }, [settings, setUpdateAvailable]);

  return { getLastVersion };
};

export default useUpdate;
