import type { GraphNode } from '../types/graph';

export function getDirectParents(nodeId: string, nodes: GraphNode[]): GraphNode[] {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return [];
  return node.data.prerequisites
    .map((pid) => nodes.find((n) => n.id === pid))
    .filter((n): n is GraphNode => n !== undefined);
}

export function getAllAncestors(nodeId: string, nodes: GraphNode[]): GraphNode[] {
  const visited = new Set<string>();
  const result: GraphNode[] = [];

  function traverse(id: string) {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    for (const prereqId of node.data.prerequisites) {
      if (!visited.has(prereqId)) {
        visited.add(prereqId);
        const prereqNode = nodes.find((n) => n.id === prereqId);
        if (prereqNode) {
          result.push(prereqNode);
          traverse(prereqId);
        }
      }
    }
  }

  traverse(nodeId);
  return result;
}

export function getTransitiveAncestors(nodeId: string, nodes: GraphNode[]): GraphNode[] {
  const directParentIds = new Set(getDirectParents(nodeId, nodes).map((n) => n.id));
  return getAllAncestors(nodeId, nodes).filter((n) => !directParentIds.has(n.id));
}
