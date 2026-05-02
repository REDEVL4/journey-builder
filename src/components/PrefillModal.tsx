import { useEffect, useRef, useState, useMemo } from 'react';
import type { ActionGraph, PrefillValue } from '../types/graph';
import type { DataSourceGroup, FieldOption } from '../sources/types';
import { DATA_SOURCES } from '../sources/registry';
import styles from './PrefillModal.module.css';

interface Props {
  fieldKey: string;
  fieldLabel: string;
  nodeId: string;
  graph: ActionGraph;
  onSelect: (value: PrefillValue) => void;
  onClose: () => void;
}

/** All groups from every DataSource, flattened into a single list for the accordion. */
function collectGroups(nodeId: string, graph: ActionGraph): DataSourceGroup[] {
  return DATA_SOURCES.flatMap((source) => source.getFieldGroups(nodeId, graph));
}

export function PrefillModal({ fieldLabel, nodeId, graph, onSelect, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<FieldOption | null>(null);

  const allGroups = useMemo(() => collectGroups(nodeId, graph), [nodeId, graph]);

  /** Groups visible after applying the search query */
  const filteredGroups = useMemo(() => {
    if (!query.trim()) return allGroups;
    const q = query.toLowerCase();
    return allGroups
      .map((group) => ({
        ...group,
        fields: group.fields.filter(
          (f) =>
            f.label.toLowerCase().includes(q) ||
            f.fieldKey.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.groupLabel.toLowerCase().includes(q) || g.fields.length > 0);
  }, [allGroups, query]);

  // Auto-expand groups that match a search query
  useEffect(() => {
    if (query.trim()) {
      setExpandedGroups(new Set(filteredGroups.map((g) => g.groupLabel)));
    }
  }, [query, filteredGroups]);

  useEffect(() => {
    dialogRef.current?.showModal();
    searchRef.current?.focus();
    return () => dialogRef.current?.close();
  }, []);

  function toggleGroup(label: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  function handleConfirm() {
    if (!pending) return;
    if (pending.sourceType === 'form_field') {
      onSelect({ type: 'form_field', nodeId: pending.sourceId, fieldKey: pending.fieldKey });
    } else {
      onSelect({ type: 'global', sourceId: pending.sourceId, fieldKey: pending.fieldKey });
    }
    onClose();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClick={handleBackdropClick}>
      <div className={styles.content}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Select data element to map</h3>
            <p className={styles.fieldHint}>Mapping: <strong>{fieldLabel}</strong></p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* ── Search ── */}
        <div className={styles.searchWrap}>
          <p className={styles.availableLabel}>Available data</p>
          <div className={styles.searchRow}>
            <span className={styles.searchIcon} aria-hidden>🔍</span>
            <input
              ref={searchRef}
              className={styles.searchInput}
              type="search"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search data elements"
            />
          </div>
        </div>

        {/* ── Accordion tree ── */}
        <div className={styles.tree} role="tree">
          {filteredGroups.length === 0 ? (
            <p className={styles.empty}>
              {allGroups.length === 0
                ? 'No upstream data available for this form.'
                : 'No results match your search.'}
            </p>
          ) : (
            filteredGroups.map((group) => {
              const isOpen = expandedGroups.has(group.groupLabel);
              return (
                <div key={group.groupLabel} className={styles.group} role="treeitem" aria-expanded={isOpen}>
                  <button
                    className={styles.groupHeader}
                    onClick={() => toggleGroup(group.groupLabel)}
                    aria-expanded={isOpen}
                  >
                    <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>›</span>
                    <span className={styles.groupLabel}>{group.groupLabel}</span>
                  </button>

                  {isOpen && (
                    <ul className={styles.fieldList} role="group">
                      {group.fields.map((field) => {
                        const isSelected =
                          pending?.sourceId === field.sourceId &&
                          pending?.fieldKey === field.fieldKey;
                        return (
                          <li key={`${field.sourceId}-${field.fieldKey}`} role="treeitem">
                            <button
                              className={`${styles.fieldBtn} ${isSelected ? styles.fieldSelected : ''}`}
                              onClick={() => setPending(field)}
                            >
                              {field.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            CANCEL
          </button>
          <button
            className={styles.selectBtn}
            onClick={handleConfirm}
            disabled={!pending}
          >
            SELECT
          </button>
        </div>
      </div>
    </dialog>
  );
}
