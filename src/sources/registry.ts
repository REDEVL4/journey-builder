import type { DataSource } from './types';
import { formFieldSource } from './formFieldSource';
import { globalDataSource } from './globalDataSource';

/**
 * All registered data sources, in the order they appear in the prefill modal.
 * To add a new data source:
 *   1. Create a file implementing the DataSource interface (see types.ts).
 *   2. Import and append it here.
 */
// Order matches the PDF modal: global sources first, then form-field sources
// (which internally return transitive ancestors before direct parents).
export const DATA_SOURCES: DataSource[] = [globalDataSource, formFieldSource];
