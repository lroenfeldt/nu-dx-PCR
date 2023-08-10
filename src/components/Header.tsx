import { useEffect, useCallback } from 'react';
import { FiSettings, FiPower, FiList } from 'react-icons/fi';
import { BsEject } from 'react-icons/bs';
import { VscSync } from 'react-icons/vsc';
import { useData, useTranslation, useBackgroundProcesses } from '../hooks';
import nuDiagnostics from '../assets/Logos/nu-diagnostics/nu-diagnostics white.png';
import { useNavigate, useLocation } from 'react-router-dom';
import Settings from './Settings/Settings';
import Notifications from './Notifications';
import ArrowBox from './ArrowBox';
import { Oval } from 'react-loader-spinner';
import SelectTestResults from './SelectTestResults/SelectTestResults';
import { IError } from '../types/interfaces/interfaces';

const Header = () => {
  const {
    demo,
    reboot,
    loading,
    shutdown,
    menuOpen,
    toggleLid,
    toggleDemo,
    resultList,
    offlineMode,
    setMenuOpen,
    openResults,
    dbConnection,
    setOfflineMode,
    setOpenResults,
    updateAvailable,
  } = useData();
  const { setErrors } = useData();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useBackgroundProcesses();

  const logo = () => {
    return (
      location.pathname !== '/selectMethod' &&
      (!loading ? (
        <div className="logoWrapper" onDoubleClick={() => navigate('/debug')}>
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
    if (location.pathname == '/enterBarcodes') {
      const inputFeld = document.getElementsByTagName('input')[0];
      inputFeld.focus();
    }
  }, [menuOpen, location.pathname]);
  const openMenu = (key: number | null) => {
    if (menuOpen !== key) {
      setMenuOpen(key);
    } else {
      setMenuOpen(null);
    }
  };

  const showMenu = () => {
    return (
      <ArrowBox
        children={
          <div className="power arrow">
            {menuOpen === 1 && <button onClick={() => shutdown()}>{t('common.shutdown')}</button>}
            {menuOpen === 1 && <button onClick={() => reboot()}>{t('common.reboot')}</button>}
          </div>
        }
        style={undefined}
        direction={`top top-power ${menuOpen ? 'active ' : ''} `}
      />
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
      setErrors((prevErrors: IError[]) =>
        prevErrors
          .filter((error: IError) => error.type !== 'stillOffline')
          .concat({
            type: 'stillOffline',
            message: t('common.stillOffline'),
          })
      );
    } else {
      setOfflineMode(false);
      setErrors((prevErrors: IError[]) => prevErrors.filter((error) => error.type !== 'stillOffline'));
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
          {location.pathname === '/selectMethod' && !menuOpen && (
            <div className="menu-item" onClick={() => navigate('/ResultList')}>
              <FiList />
              {resultList.length > 0 ? <Notifications>{resultList.length}</Notifications> : ''}
            </div>
          )}

          {location.pathname !== '/testRunning' && !menuOpen && (
            <div className="menu-item" onClick={() => toggleLid()}>
              <BsEject />
            </div>
          )}
          <div className="menu-item" onClick={() => openMenu(2)} id="menu-item-settings">
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
      {menuOpen && <div className="clickAnywhere" onClick={() => openMenu(null)}></div>}
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
