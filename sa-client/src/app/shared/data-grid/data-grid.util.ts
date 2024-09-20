import { Column } from './data-grid';

export const mapColumnsToColumnNames = (columns: Column[]): string[] => {
  const names: string[] = [];
  for (const col of columns) {
    names.push(col.name);
  }
  return names;
}
