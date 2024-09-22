export type Column = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date';
};

export type DataTableFilter = {
  columns: Column[];
  filters: ColumnFilter[];
  sorts: Sort[];
};

export type ColumnFilter = {
  column: string;
  operator: string;
  columnFilters: {
    value: string | number;
    matchMode: string;
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
  dataTableFilter: Omit<DataTableFilter, 'columns'> & { columns: string[] };
  paginate: Paginate;
};
