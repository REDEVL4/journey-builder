import { useState, useCallback } from 'react';
import type { ActionGraph, InputMapping, PrefillValue } from '../types/graph';

type AllMappings = Record<string, InputMapping>;

function buildInitialMappings(graph: ActionGraph): AllMappings {
  const result: AllMappings = {};
  for (const node of graph.nodes) {
    result[node.id] = { ...node.data.input_mapping };
  }
  return result;
}

export function usePrefill(graph: ActionGraph | null) {
  const [allMappings, setAllMappings] = useState<AllMappings>(() =>
    graph ? buildInitialMappings(graph) : {},
  );

  // Re-initialise when graph loads (only on first graph load)
  const [initialised, setInitialised] = useState(false);
  if (graph && !initialised) {
    setAllMappings(buildInitialMappings(graph));
    setInitialised(true);
  }

  const setFieldMapping = useCallback(
    (nodeId: string, fieldKey: string, value: PrefillValue) => {
      setAllMappings((prev) => ({
        ...prev,
        [nodeId]: { ...prev[nodeId], [fieldKey]: value },
      }));
    },
    [],
  );

  const clearFieldMapping = useCallback((nodeId: string, fieldKey: string) => {
    setAllMappings((prev) => {
      const updated = { ...prev[nodeId] };
      delete updated[fieldKey];
      return { ...prev, [nodeId]: updated };
    });
  }, []);

  const getMappingForNode = useCallback(
    (nodeId: string): InputMapping => allMappings[nodeId] ?? {},
    [allMappings],
  );

  return { getMappingForNode, setFieldMapping, clearFieldMapping };
}
