import React, { useEffect } from 'react';
import { Testselection } from '../components';
import { useData } from '../hooks';
import logo_medium from '../img/nu-dx PCR Logo white.png';
function Home() {
  const { setOfflineMode, setDeviceStatus } = useData();
  useEffect(() => {
    setDeviceStatus('IDLE');
  }, []);
  return (
    <>
      <div className="intro">
        <img src={logo_medium} alt="logo_medium" />
      </div>
      <div className="Main">
        <Testselection />
      </div>
    </>
  );
}

export default Home;
