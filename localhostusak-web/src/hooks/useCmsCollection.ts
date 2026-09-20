import { useCallback, useEffect, useState } from 'react';

export function useCmsCollection<T>(load: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(false);
    load()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [load, revision]);

  const retry = useCallback(() => setRevision((value) => value + 1), []);
  return { items, isLoading, error, retry };
}
