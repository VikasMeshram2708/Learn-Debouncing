import { useEffect, useState } from "react";

export default function useDebouncer<T>(value: T, delay = 1000): T {
  const [debounedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounedValue;
}
