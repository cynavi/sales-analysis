export type Column = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date';
};

export type Filter = {
  columns: Column[];
  columnFilters: ColumnFilter[];
  sorts: Sort[];
};

export type ColumnFilter = {
  column: string;
  filters: {
    value: string | number;
    matchMode: string;
    operator: string;
  }[];
};

export type Sort = {
  column: string;
  order: 'asc' | 'desc'
};

export type Paginate = {
  pageSize: number;
  offset: number;
};

export type DataGridCriteria = {
  filter: Omit<Filter, 'columns'> & { columns: string[] };
  paginate: Paginate;
};
