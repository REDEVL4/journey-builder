import { useState } from 'react';
import type { ActionGraph, GraphNode, InputMapping, PrefillValue } from '../types/graph';
import { PrefillModal } from './PrefillModal';
import styles from './PrefillPanel.module.css';

interface Props {
  node: GraphNode;
  graph: ActionGraph;
  mapping: InputMapping;
  onSet: (fieldKey: string, value: PrefillValue) => void;
  onClear: (fieldKey: string) => void;
}

export function PrefillPanel({ node, graph, mapping, onSet, onClear }: Props) {
  const [openFieldKey, setOpenFieldKey] = useState<string | null>(null);

  const formDef = graph.forms.find((f) => f.id === node.data.component_id);
  if (!formDef) return <p className={styles.error}>Form definition not found.</p>;

  const fields = Object.entries(formDef.field_schema.properties).filter(
    ([, schema]) => schema.avantos_type !== 'button',
  );

  function getMappingLabel(fieldKey: string): string | null {
    const prefill = mapping[fieldKey];
    if (!prefill) return null;

    if (prefill.type === 'form_field') {
      const sourceNode = graph.nodes.find((n) => n.id === prefill.nodeId);
      if (!sourceNode) return `Unknown form > ${prefill.fieldKey}`;
      const sourceFormDef = graph.forms.find((f) => f.id === sourceNode.data.component_id);
      const fieldTitle =
        sourceFormDef?.field_schema.properties[prefill.fieldKey]?.title ?? prefill.fieldKey;
      return `${sourceNode.data.name} > ${fieldTitle}`;
    }

    if (prefill.type === 'global') {
      const sourceName =
        prefill.sourceId === 'client_org'
          ? 'Client Organisation'
          : prefill.sourceId === 'action_props'
            ? 'Action Properties'
            : prefill.sourceId;
      return `${sourceName} > ${prefill.fieldKey}`;
    }

    return null;
  }

  const openField = openFieldKey ? fields.find(([k]) => k === openFieldKey) : null;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.formName}>{node.data.name}</h2>
        <p className={styles.formId}>Prefill Configuration</p>
      </div>

      <ul className={styles.fieldList}>
        {fields.map(([fieldKey, schema]) => {
          const label = getMappingLabel(fieldKey);
          return (
            <li key={fieldKey} className={styles.fieldRow}>
              <button
                className={`${styles.fieldCell} ${label ? styles.mapped : styles.unmapped}`}
                onClick={() => !label && setOpenFieldKey(fieldKey)}
                disabled={!!label}
                title={label ? undefined : 'Click to set prefill'}
              >
                <span className={styles.fieldName}>{schema.title ?? fieldKey}</span>
                {label ? (
                  <span className={styles.mappingLabel}>{label}</span>
                ) : (
                  <span className={styles.placeholder}>Click to configure prefill</span>
                )}
              </button>
              {label && (
                <button
                  className={styles.clearBtn}
                  onClick={() => onClear(fieldKey)}
                  aria-label={`Clear prefill for ${schema.title ?? fieldKey}`}
                  title="Clear prefill"
                >
                  ✕
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {openFieldKey && openField && (
        <PrefillModal
          fieldKey={openFieldKey}
          fieldLabel={openField[1].title ?? openFieldKey}
          nodeId={node.id}
          graph={graph}
          onSelect={(value) => {
            onSet(openFieldKey, value);
            setOpenFieldKey(null);
          }}
          onClose={() => setOpenFieldKey(null)}
        />
      )}
    </div>
  );
}
