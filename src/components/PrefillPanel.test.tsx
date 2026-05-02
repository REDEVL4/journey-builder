import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrefillPanel } from './PrefillPanel';
import { mockGraph } from '../test/fixtures';

const nodeC = mockGraph.nodes.find((n) => n.id === 'node-c')!;

describe('PrefillPanel', () => {
  it('renders all non-button fields for the selected form', () => {
    render(
      <PrefillPanel
        node={nodeC}
        graph={mockGraph}
        mapping={{}}
        onSet={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.queryByText('Button')).not.toBeInTheDocument();
  });

  it('shows a mapped label when input_mapping is provided', () => {
    render(
      <PrefillPanel
        node={nodeC}
        graph={mockGraph}
        mapping={{ email: { type: 'form_field', nodeId: 'node-b', fieldKey: 'email' } }}
        onSet={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    expect(screen.getByText(/Form B > Email/)).toBeInTheDocument();
  });

  it('calls onClear when the X button is clicked', () => {
    const onClear = vi.fn();
    render(
      <PrefillPanel
        node={nodeC}
        graph={mockGraph}
        mapping={{ email: { type: 'form_field', nodeId: 'node-b', fieldKey: 'email' } }}
        onSet={vi.fn()}
        onClear={onClear}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Clear prefill for Email/i }));
    expect(onClear).toHaveBeenCalledWith('email');
  });

  it('shows placeholder text for all unmapped fields', () => {
    render(
      <PrefillPanel
        node={nodeC}
        graph={mockGraph}
        mapping={{}}
        onSet={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    const placeholders = screen.getAllByText(/Click to configure prefill/i);
    expect(placeholders.length).toBeGreaterThan(0);
  });
});
