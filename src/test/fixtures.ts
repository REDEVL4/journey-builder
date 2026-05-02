import type { ActionGraph } from '../types/graph';

const BASE_FIELD_SCHEMA = {
  type: 'object' as const,
  properties: {
    email: { avantos_type: 'short-text', title: 'Email', type: 'string', format: 'email' },
    name: { avantos_type: 'short-text', title: 'Name', type: 'string' },
    notes: { avantos_type: 'multi-line-text', title: 'Notes', type: 'string' },
    button: { avantos_type: 'button', title: 'Button', type: 'object' },
  },
  required: ['email', 'name'],
};

/**
 * Minimal graph:  A → B → C
 *
 * formA  (no prerequisites)
 * formB  (prerequisites: [formA])
 * formC  (prerequisites: [formB])
 */
export const mockGraph: ActionGraph = {
  id: 'bp_test',
  tenant_id: '1',
  name: 'Test Blueprint',
  description: '',
  category: '',
  forms: [
    {
      id: 'form_def_1',
      name: 'Shared Form',
      description: '',
      is_reusable: false,
      field_schema: BASE_FIELD_SCHEMA,
      ui_schema: {},
      dynamic_field_config: {},
    },
  ],
  nodes: [
    {
      id: 'node-a',
      type: 'form',
      position: { x: 0, y: 0 },
      data: {
        id: 'bp_c_a',
        component_key: 'node-a',
        component_type: 'form',
        component_id: 'form_def_1',
        name: 'Form A',
        prerequisites: [],
        permitted_roles: [],
        input_mapping: {},
        sla_duration: { number: 0, unit: 'minutes' },
        approval_required: false,
        approval_roles: [],
      },
    },
    {
      id: 'node-b',
      type: 'form',
      position: { x: 200, y: 0 },
      data: {
        id: 'bp_c_b',
        component_key: 'node-b',
        component_type: 'form',
        component_id: 'form_def_1',
        name: 'Form B',
        prerequisites: ['node-a'],
        permitted_roles: [],
        input_mapping: {},
        sla_duration: { number: 0, unit: 'minutes' },
        approval_required: false,
        approval_roles: [],
      },
    },
    {
      id: 'node-c',
      type: 'form',
      position: { x: 400, y: 0 },
      data: {
        id: 'bp_c_c',
        component_key: 'node-c',
        component_type: 'form',
        component_id: 'form_def_1',
        name: 'Form C',
        prerequisites: ['node-b'],
        permitted_roles: [],
        input_mapping: {},
        sla_duration: { number: 0, unit: 'minutes' },
        approval_required: false,
        approval_roles: [],
      },
    },
  ],
  edges: [
    { source: 'node-a', target: 'node-b' },
    { source: 'node-b', target: 'node-c' },
  ],
};
