import type { GraphNode } from '../types/graph';
import styles from './FormList.module.css';

interface Props {
  nodes: GraphNode[];
  selectedNodeId: string | null;
  onSelect: (nodeId: string) => void;
}

export function FormList({ nodes, selectedNodeId, onSelect }: Props) {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.heading}>Forms</h2>
      <ul className={styles.list}>
        {nodes.map((node) => (
          <li key={node.id}>
            <button
              className={`${styles.item} ${node.id === selectedNodeId ? styles.selected : ''}`}
              onClick={() => onSelect(node.id)}
            >
              <span className={styles.name}>{node.data.name}</span>
              {node.data.prerequisites.length === 0 && (
                <span className={styles.badge}>root</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
