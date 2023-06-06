import React, { useEffect } from 'react';
import { Testselection } from '../components';
import { useData } from '../hooks';
import logo_medium from '../img/logo_medium.png';
function Home() {
  const { setOfflineMode, setDeviceStatus } = useData();
  useEffect(() => {
    setDeviceStatus('IDLE');
  }, []);
  return (
    <>
      <div className="intro">
        <img src={logo_medium} alt="logo_medium" />
        <div className="appTitle">
          <span style={{ fontWeight: '' }}>PhoenixDx® </span>
          <span style={{ fontWeight: '200' }}>POC</span>
        </div>
      </div>
      <div className="Main">
        <Testselection />
      </div>
    </>
  );
}

export default Home;
