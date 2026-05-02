import type { ActionGraph } from '../types/graph';
import { getDirectParents, getTransitiveAncestors } from '../lib/dagUtils';
import type { DataSource, DataSourceGroup, FieldOption } from './types';

/**
 * A virtual system field added to every submitted form.
 * `completed_at` is not part of the JSON Schema but is always available
 * as a completion timestamp once the form has been filled.
 */
const SYSTEM_FIELDS: FieldOption[] = [
  {
    label: 'completed_at',
    sourceId: '',   // filled in per-node below
    fieldKey: 'completed_at',
    sourceType: 'form_field',
  },
];

function extractFields(
  node: { id: string; data: { name: string; component_id: string } },
  graph: ActionGraph,
): DataSourceGroup | null {
  const formDef = graph.forms.find((f) => f.id === node.data.component_id);
  if (!formDef) return null;

  // System fields first (with the correct nodeId injected)
  const systemFields: FieldOption[] = SYSTEM_FIELDS.map((f) => ({ ...f, sourceId: node.id }));

  // All schema fields — buttons are valid sources (they carry dynamic data)
  const schemaFields: FieldOption[] = Object.entries(formDef.field_schema.properties).map(
    ([key, schema]) => ({
      label: schema.title ?? key,
      sourceId: node.id,
      fieldKey: key,
      sourceType: 'form_field',
    }),
  );

  return {
    groupLabel: node.data.name,
    fields: [...systemFields, ...schemaFields],
  };
}

export const formFieldSource: DataSource = {
  id: 'form_field',
  label: 'Form Fields',

  getFieldGroups(nodeId: string, graph: ActionGraph): DataSourceGroup[] {
    const directParents = getDirectParents(nodeId, graph.nodes);
    const transitiveAncestors = getTransitiveAncestors(nodeId, graph.nodes);

    const groups: DataSourceGroup[] = [];

    // Transitive ancestors first (farther in the DAG → listed above closer ones,
    // matching the PDF ordering: Form A before Form B for Form D)
    for (const ancestor of transitiveAncestors) {
      const group = extractFields(ancestor, graph);
      if (group) groups.push(group);
    }

    // Direct parents second
    for (const parent of directParents) {
      const group = extractFields(parent, graph);
      if (group) groups.push(group);
    }

    return groups;
  },
};
