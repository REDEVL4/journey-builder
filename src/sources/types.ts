import type { ActionGraph } from '../types/graph';

export interface FieldOption {
  label: string;
  sourceId: string;
  fieldKey: string;
  sourceType: string;
}

export interface DataSourceGroup {
  groupLabel: string;
  fields: FieldOption[];
}

/**
 * A DataSource provides a set of field options that can be used to prefill
 * a target form's fields. Implement this interface to add new data sources.
 *
 * To register a new source, add an instance to src/sources/registry.ts.
 */
export interface DataSource {
  /** Unique identifier for this source type (used in PrefillValue.type) */
  readonly id: string;
  /** Human-readable name shown in the modal header */
  readonly label: string;
  /**
   * Returns grouped field options available to prefill fields on the node
   * identified by `nodeId`. Return an empty array if no fields apply.
   */
  getFieldGroups(nodeId: string, graph: ActionGraph): DataSourceGroup[];
}
