import React, { useEffect } from 'react';
import { useData } from './useData';

export default function useCheckConnectivity() {
  const { setOfflineMode, offlineMode } = useData();

  useEffect(() => {
    const updateOnlineStatus = () => {
      setOfflineMode(!navigator.onLine);
      console.log(navigator.onLine ? 'online' : 'offline');
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [navigator?.onLine, offlineMode]);

  return !navigator.onLine;
}
