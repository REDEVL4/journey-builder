import { describe, it, expect } from 'vitest';
import { globalDataSource } from './globalDataSource';
import { mockGraph } from '../test/fixtures';

describe('globalDataSource', () => {
  it('always returns groups regardless of the node', () => {
    const groups = globalDataSource.getFieldGroups('node-a', mockGraph);
    expect(groups.length).toBeGreaterThan(0);
  });

  it('lists Action Properties first (matching PDF order)', () => {
    const groups = globalDataSource.getFieldGroups('node-a', mockGraph);
    expect(groups[0].groupLabel).toBe('Action Properties');
  });

  it('includes Client Organisation Properties with British spelling', () => {
    const groups = globalDataSource.getFieldGroups('node-a', mockGraph);
    const labels = groups.map((g) => g.groupLabel);
    expect(labels).toContain('Client Organisation Properties');
    expect(labels).not.toContain('Client Organization Properties');
  });

  it('all fields have sourceType global', () => {
    const groups = globalDataSource.getFieldGroups('node-a', mockGraph);
    for (const group of groups) {
      for (const field of group.fields) {
        expect(field.sourceType).toBe('global');
      }
    }
  });
});
