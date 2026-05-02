import { useEffect, useState } from 'react';
import { fetchActionGraph } from '../api/graphApi';
import type { ActionGraph } from '../types/graph';

interface UseGraphResult {
  graph: ActionGraph | null;
  loading: boolean;
  error: string | null;
}

export function useGraph(): UseGraphResult {
  const [graph, setGraph] = useState<ActionGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchActionGraph()
      .then((data) => {
        if (!cancelled) setGraph(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { graph, loading, error };
}
