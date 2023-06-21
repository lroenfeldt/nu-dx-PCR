import React, { useEffect, useState } from 'react';
import { useData } from './useData';
/**
 * Checks if the device is connected to the internet
 * @returns {boolean} true if connected, false if not
 * @example const { checkConnectivity } = useCheckConnectivity();
 * */
export default function useCheckConnectivity() {
  const [stand, setStand] = useState('');
  const { setOfflineMode, offlineMode } = useData();
  const check = async () => {
    window.addEventListener('online', () => {
      setOfflineMode(false);
    });
    window.addEventListener('offline', () => {
      setOfflineMode(true);
    });
  };

  useEffect(() => {
    check();
  }, [offlineMode]);
  /* useEffect(() => {
    setInterval(check, 30000);
  }, []);*/
  if (!offlineMode && stand == 'offline') setOfflineMode(true);
  if (offlineMode && stand == 'online') setOfflineMode(false);
  return stand;
}
