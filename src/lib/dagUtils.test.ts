import { describe, it, expect } from 'vitest';
import { getDirectParents, getAllAncestors, getTransitiveAncestors } from './dagUtils';
import { mockGraph } from '../test/fixtures';

const { nodes } = mockGraph;

describe('getDirectParents', () => {
  it('returns empty array for a root node', () => {
    expect(getDirectParents('node-a', nodes)).toEqual([]);
  });

  it('returns the immediate parent', () => {
    const parents = getDirectParents('node-b', nodes);
    expect(parents).toHaveLength(1);
    expect(parents[0].id).toBe('node-a');
  });

  it('returns the single direct parent of node-c (not node-a)', () => {
    const parents = getDirectParents('node-c', nodes);
    expect(parents).toHaveLength(1);
    expect(parents[0].id).toBe('node-b');
  });

  it('returns empty array for an unknown node id', () => {
    expect(getDirectParents('does-not-exist', nodes)).toEqual([]);
  });
});

describe('getAllAncestors', () => {
  it('returns empty array for a root node', () => {
    expect(getAllAncestors('node-a', nodes)).toEqual([]);
  });

  it('returns only the direct parent for node-b', () => {
    const ancestors = getAllAncestors('node-b', nodes);
    expect(ancestors.map((n) => n.id)).toEqual(['node-a']);
  });

  it('returns both ancestors for node-c', () => {
    const ancestors = getAllAncestors('node-c', nodes);
    const ids = ancestors.map((n) => n.id);
    expect(ids).toContain('node-a');
    expect(ids).toContain('node-b');
    expect(ids).toHaveLength(2);
  });
});

describe('getTransitiveAncestors', () => {
  it('returns empty for root', () => {
    expect(getTransitiveAncestors('node-a', nodes)).toEqual([]);
  });

  it('returns empty for node-b (its only ancestor is a direct parent)', () => {
    expect(getTransitiveAncestors('node-b', nodes)).toEqual([]);
  });

  it('returns node-a as a transitive ancestor of node-c', () => {
    const transitive = getTransitiveAncestors('node-c', nodes);
    expect(transitive).toHaveLength(1);
    expect(transitive[0].id).toBe('node-a');
  });
});
