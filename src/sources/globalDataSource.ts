import type { ActionGraph } from '../types/graph';
import type { DataSource, DataSourceGroup } from './types';

/**
 * Provides global (non-form) data fields for prefill.
 *
 * To add more global data, either extend the groups array below or create a
 * separate DataSource implementation and register it in registry.ts.
 */
export const globalDataSource: DataSource = {
  id: 'global',
  label: 'Global Data',

  getFieldGroups(_nodeId: string, _graph: ActionGraph): DataSourceGroup[] {
    return [
      {
        // Listed first, matching the PDF modal order
        groupLabel: 'Action Properties',
        fields: [
          { label: 'id', sourceId: 'action_props', fieldKey: 'id', sourceType: 'global' },
          { label: 'name', sourceId: 'action_props', fieldKey: 'name', sourceType: 'global' },
          { label: 'created_at', sourceId: 'action_props', fieldKey: 'created_at', sourceType: 'global' },
        ],
      },
      {
        // British spelling matches the challenge PDF exactly
        groupLabel: 'Client Organisation Properties',
        fields: [
          { label: 'id', sourceId: 'client_org', fieldKey: 'id', sourceType: 'global' },
          { label: 'name', sourceId: 'client_org', fieldKey: 'name', sourceType: 'global' },
          { label: 'email', sourceId: 'client_org', fieldKey: 'email', sourceType: 'global' },
        ],
      },
    ];
  },
};
