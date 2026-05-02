import { useState } from 'react';
import { useGraph } from './hooks/useGraph';
import { usePrefill } from './hooks/usePrefill';
import { FormList } from './components/FormList';
import { PrefillPanel } from './components/PrefillPanel';
import styles from './App.module.css';

export default function App() {
  const { graph, loading, error } = useGraph();
  const { getMappingForNode, setFieldMapping, clearFieldMapping } = usePrefill(graph);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  if (loading) return <div className={styles.status}>Loading graph…</div>;
  if (error) return <div className={styles.statusError}>Error: {error}</div>;
  if (!graph) return null;

  const selectedNode = graph.nodes.find((n) => n.id === selectedNodeId) ?? null;

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <span className={styles.logo}>Journey Builder</span>
        <span className={styles.blueprintName}>{graph.name}</span>
      </header>

      <div className={styles.body}>
        <FormList
          nodes={graph.nodes}
          selectedNodeId={selectedNodeId}
          onSelect={setSelectedNodeId}
        />

        <main className={styles.main}>
          {selectedNode ? (
            <PrefillPanel
              node={selectedNode}
              graph={graph}
              mapping={getMappingForNode(selectedNode.id)}
              onSet={(fieldKey, value) => setFieldMapping(selectedNode.id, fieldKey, value)}
              onClear={(fieldKey) => clearFieldMapping(selectedNode.id, fieldKey)}
            />
          ) : (
            <div className={styles.empty}>
              <p>Select a form from the list to configure its prefill mapping.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
