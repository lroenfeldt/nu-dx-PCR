import { useState } from "react";

const useLocalstorage = (key: string, initialValue: string) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

useLocalstorage.remove = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};

useLocalstorage.clear = () => {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error(error);
  }
};

export default useLocalstorage;
