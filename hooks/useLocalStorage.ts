import React, { useState, useEffect } from 'react';

/**
 * A custom React hook to persist state to the browser's localStorage.
 * This version synchronously reads from localStorage on initialization to avoid race conditions.
 * @param key The key to use for storing the value in localStorage.    
 * @param initialValue The initial value to use if nothing is found in localStorage.
 * @returns A stateful value, and a function to update it.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Use a function for useState's initial value to read from localStorage only once.
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue if it doesn't exist.
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }); 

  // Use useEffect to update localStorage whenever the state changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
