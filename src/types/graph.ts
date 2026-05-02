export interface FieldSchema {
  type: string;
  title?: string;
  avantos_type?: string;
  format?: string;
  properties?: Record<string, FieldSchema>;
  items?: { enum?: string[]; type?: string };
  enum?: unknown[] | null;
  uniqueItems?: boolean;
  required?: string[];
}

export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: FieldSchema & { properties: Record<string, FieldSchema> };
  ui_schema: unknown;
  dynamic_field_config: Record<string, unknown>;
}

export interface NodeData {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles: string[];
  input_mapping: InputMapping;
  sla_duration: { number: number; unit: string };
  approval_required: boolean;
  approval_roles: string[];
}

export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface ActionGraph {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormDefinition[];
}

export type PrefillValue =
  | { type: 'form_field'; nodeId: string; fieldKey: string }
  | { type: 'global'; sourceId: string; fieldKey: string };

export type InputMapping = Record<string, PrefillValue>;
