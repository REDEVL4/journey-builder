import { describe, it, expect } from 'vitest';
import { formFieldSource } from './formFieldSource';
import { mockGraph } from '../test/fixtures';

describe('formFieldSource', () => {
  it('returns no groups for a root node (no parents)', () => {
    const groups = formFieldSource.getFieldGroups('node-a', mockGraph);
    expect(groups).toEqual([]);
  });

  it('returns one group for node-b, labelled by form name (no suffix)', () => {
    const groups = formFieldSource.getFieldGroups('node-b', mockGraph);
    expect(groups).toHaveLength(1);
    expect(groups[0].groupLabel).toBe('Form A');
  });

  it('includes completed_at as the first field in every group', () => {
    const groups = formFieldSource.getFieldGroups('node-b', mockGraph);
    expect(groups[0].fields[0].fieldKey).toBe('completed_at');
  });

  it('includes button fields (not filtered out from sources)', () => {
    const groups = formFieldSource.getFieldGroups('node-b', mockGraph);
    const fieldKeys = groups.flatMap((g) => g.fields.map((f) => f.fieldKey));
    expect(fieldKeys).toContain('button');
  });

  it('returns transitive ancestors BEFORE direct parents for node-c', () => {
    const groups = formFieldSource.getFieldGroups('node-c', mockGraph);
    expect(groups).toHaveLength(2);
    // Form A is transitive → listed first
    expect(groups[0].groupLabel).toBe('Form A');
    // Form B is direct → listed second
    expect(groups[1].groupLabel).toBe('Form B');
  });

  it('all form_field fields carry correct sourceType', () => {
    const groups = formFieldSource.getFieldGroups('node-c', mockGraph);
    for (const group of groups) {
      for (const field of group.fields) {
        expect(field.sourceType).toBe('form_field');
      }
    }
  });

  it('direct group fields carry the correct nodeId', () => {
    const groups = formFieldSource.getFieldGroups('node-b', mockGraph);
    // All fields in the Form A group should reference node-a
    for (const field of groups[0].fields) {
      expect(field.sourceId).toBe('node-a');
    }
  });
});
