# Journey Builder – Prefill Configuration UI

A React + TypeScript app that lets you view and edit the prefill mapping for a DAG of forms.

## Quick Start

### 1. Start the mock API server

```bash
git clone https://github.com/mosaic-avantos/frontendchallengeserver
cd frontendchallengeserver
npm install
npm start          # listens on http://localhost:3000
```

### 2. Start the React dev server

```bash
cd journey-builder
npm install
npm run dev        # http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to the mock server on port 3000.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |

## How It Works

1. On load the app fetches the blueprint graph from `/api/v1/{tenant}/actions/blueprints/{id}/graph/`.
2. The left sidebar lists every form node. Click one to open its prefill panel.
3. Each row shows a form field. A configured prefill is shown in blue — click **✕** to clear it.
4. Clicking an unmapped row opens a modal listing all available data sources grouped by form and category.

## Architecture

```
src/
├── api/
│   └── graphApi.ts          Fetch the blueprint graph
├── types/
│   └── graph.ts             TypeScript interfaces for all API shapes
├── lib/
│   └── dagUtils.ts          DAG traversal helpers
├── sources/
│   ├── types.ts             DataSource interface
│   ├── formFieldSource.ts   Upstream form fields (direct + transitive)
│   ├── globalDataSource.ts  Client org / action properties
│   └── registry.ts          Ordered list of active data sources
├── hooks/
│   ├── useGraph.ts          Fetch + hold the blueprint graph
│   └── usePrefill.ts        Manage input_mapping state across all nodes
└── components/
    ├── FormList.tsx         Left sidebar – form node list
    ├── PrefillPanel.tsx     Field list for the selected node
    └── PrefillModal.tsx     Source-picker dialog
```

## Adding a New Data Source

1. Create `src/sources/mySource.ts` implementing the `DataSource` interface:

```typescript
import type { DataSource, DataSourceGroup } from './types';
import type { ActionGraph } from '../types/graph';

export const mySource: DataSource = {
  id: 'my_source',
  label: 'My Data Source',

  getFieldGroups(_nodeId: string, _graph: ActionGraph): DataSourceGroup[] {
    return [
      {
        groupLabel: 'My Group',
        fields: [
          {
            label: 'Field One',
            sourceId: 'my_source',
            fieldKey: 'field_one',
            sourceType: 'my_source',
          },
        ],
      },
    ];
  },
};
```

2. Register it in `src/sources/registry.ts`:

```typescript
import { mySource } from './mySource';

export const DATA_SOURCES: DataSource[] = [
  formFieldSource,
  globalDataSource,
  mySource,   // ← append here
];
```

No other code changes needed. The modal will automatically include the new source's groups.

## Tests

Tests live alongside source files (`*.test.ts` / `*.test.tsx`) and cover:

- **DAG utils** – direct parents, all ancestors, transitive-only ancestors
- **`formFieldSource`** – correct grouping, button-field exclusion, direct vs. transitive labelling, correct `sourceId`
- **`globalDataSource`** – always returns groups, correct `sourceType`
- **`PrefillPanel`** – renders all non-button fields, shows mapping labels, fires `onClear`
