import { useState } from "react";

const getLocalStorageValue = (
  key: string,
  defaultValue: any,
  validator: (arg0: any) => boolean
) => {
  const stringVal = localStorage.getItem(key);
  if (stringVal) {
    let storedValue;
    try {
      storedValue = JSON.parse(stringVal);
      if (!validator(storedValue)) {
        console.warn(`Invalid value found in local storage at key ${key}`);
        storedValue = defaultValue;
        localStorage.setItem(key, storedValue);
      }
    } catch (e) {
      console.error(e);
      localStorage.removeItem(key);
      storedValue = defaultValue;
      localStorage.setItem(key, storedValue);
    }
    return storedValue;
  }
  return defaultValue;
};

/**
 * Uses JSON.parse to safely retrieve values from local storage,
 * catching errors.
 *
 * Will clear local storage at the key if an error occurs parsing
 * the local storage value.
 *
 * Local Storage itself is not monitored for changes, so the same
 * key should not be used across multiple components or hooks.
 * @param key The local storage key to access
 * @param defaultValue: The default value to return if the key is not found or the stored value is invalid
 * @param validator A function to validate the value stored in local storage, should return true if the value is valid
 * @returns The value stored in local storage at the given key,
 * parsed, and a function to set the local storage value.
 */
const useLocalStorage = <T,>(
  key: string,
  defaultValue: T,
  validator: (val: T) => boolean = () => true
): [T, (newVal: T) => void] => {
  const [value, setValue] = useState<T>(
    getLocalStorageValue(key, defaultValue, validator)
  );

  const setter = (newVal: T) => {
    setValue(newVal);
    localStorage.setItem(key, JSON.stringify(newVal));
  };

  return [value, setter];
};

export default useLocalStorage;
