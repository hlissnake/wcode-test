import { useState, useEffect } from "react";

export function useSessionStorage<T>(key: string) {
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : undefined;
    } catch (error) {
      return undefined;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      // Ignore write errors
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
