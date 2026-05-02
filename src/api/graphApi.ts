import type { ActionGraph } from '../types/graph';

const TENANT_ID = '1';
const BLUEPRINT_ID = 'bp_01jk766tckfwx84xjcxazggzyc';

export async function fetchActionGraph(): Promise<ActionGraph> {
  const url = `/api/v1/${TENANT_ID}/actions/blueprints/${BLUEPRINT_ID}/graph/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch graph: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<ActionGraph>;
}
