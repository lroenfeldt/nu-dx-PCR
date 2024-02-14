import { useEffect, useCallback, FC } from "react";
import ArrowBox from "./ArrowBox";
import { BsEject } from "react-icons/bs";
import { VscSync } from "react-icons/vsc";
import Settings from "./Settings/Settings";
import Notifications from "./Notifications";
import { Oval } from "react-loader-spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSettings, FiPower, FiList } from "react-icons/fi";
import SelectTestResults from "./SelectTestResults/SelectTestResults";
import { useData, useTranslation, useBackgroundProcesses } from "../hooks";
import nuDiagnostics from "../assets/Logos/nu-diagnostics/nu-diagnostics white.png";
import useErrors from "../hooks/useErrors";

const Header: FC = () => {
  const {
    demo,
    reboot,
    loading,
    shutdown,
    menuOpen,
    toggleLid,
    setErrors,
    toggleDemo,
    resultList,
    offlineMode,
    setMenuOpen,
    openResults,
    dbConnection,
    setOfflineMode,
    setOpenResults,
    updateAvailable,
    failedSubmittingResults,
  } = useData();
  const { registerErrors, clearErrors } = useErrors();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  useBackgroundProcesses();

  const logo = () => {
    return (
      location.pathname !== "/selectMethod" &&
      (!loading ? (
        <div className="logoWrapper" onDoubleClick={() => navigate("/debug")}>
          <img src={nuDiagnostics} alt="" width={150} />
        </div>
      ) : (
        <div className="spinnerContainer">
          <Oval height="30" width="30" color="white" />
        </div>
      ))
    );
  };

  useEffect(() => {
    if (location.pathname == "/enterBarcodes") {
      const inputFeld = document.getElementsByTagName("input")[0];
      inputFeld.focus();
    }
  }, [menuOpen, location.pathname]);
  const openMenu = (key: number) => {
    if (menuOpen !== key) {
      setMenuOpen(key);
    } else {
      setMenuOpen(null);
    }
  };

  const showMenu = () => {
    return (
      <ArrowBox direction={`top top-power ${menuOpen ? "active " : ""} `}>
        <div className="power arrow">
          {menuOpen === 1 && (
            <button
              onClick={() => {
                setMenuOpen(null);
                shutdown();
              }}
            >
              {t("common.shutdown")}
            </button>
          )}
          {menuOpen === 1 && (
            <button
              onClick={() => {
                setMenuOpen(null);
                reboot();
              }}
            >
              {t("common.reboot")}
            </button>
          )}
        </div>
      </ArrowBox>
    );
  };

  const demoIndicator = () => {
    return (
      <div className="modeIndicator green">
        <span>Demo</span>
        <button onClick={() => toggleDemo()}>x</button>
      </div>
    );
  };

  const handleOffline = useCallback(async () => {
    if (!dbConnection) {
      registerErrors("stillOffline");
    } else {
      setOfflineMode(false);
      clearErrors("stillOffline");
    }
  }, [dbConnection]);

  const offlineIndicator = () => {
    return (
      <div className="modeIndicator red">
        <span>Offline Modus</span>
        <button onClick={() => handleOffline()}>x</button>
      </div>
    );
  };

  return (
    <>
      <div className="Header">
        <div className="menu-left">{logo()}</div>
        <div className="menu-center">
          {demo === true && demoIndicator()}
          {offlineMode === true && offlineIndicator()}
        </div>

        <div className="menu-right">
          {location.pathname === "/selectMethod" && !menuOpen && (
            <div className="menu-item" onClick={() => navigate("/ResultList")}>
              <FiList />
              {resultList.length > 0 ? (
                <Notifications>{resultList.length}</Notifications>
              ) : (
                ""
              )}
              {resultList.length > 0 && failedSubmittingResults.length > 0 ? (
                <Notifications
                  style={{
                    left: 0,
                    fontSize: 18,
                  }}
                >
                  {"!"}
                </Notifications>
              ) : (
                ""
              )}
            </div>
          )}

          {location.pathname !== "/testRunning" && !menuOpen && (
            <div className="menu-item" onClick={() => toggleLid()}>
              <BsEject />
            </div>
          )}
          <div
            className="menu-item"
            onClick={() => openMenu(2)}
            id="menu-item-settings"
          >
            <FiSettings />
            {updateAvailable && (
              <Notifications>
                <VscSync />
              </Notifications>
            )}
          </div>
          <div className="menu-item" onClick={() => openMenu(1)}>
            <FiPower />
          </div>
          {<Settings visible={menuOpen == 2} />}
          {menuOpen == 1 && showMenu()}
        </div>
      </div>
      {menuOpen && (
        <div className="clickAnywhere" onClick={() => openMenu(0)}></div>
      )}
      {openResults && (
        <SelectTestResults
          isVisible={openResults}
          onClose={() => setOpenResults(false)}
          onSelect={() => {
            setOpenResults(false);
          }}
        />
      )}
    </>
  );
};

export default Header;
