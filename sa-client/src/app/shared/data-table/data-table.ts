export type Column = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date';
};

export type DataTableFilter = {
  columns: Column[];
  filters: ColumnFilter[];
  sorts: Sort[];
  paginate: Paginate;
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
  sortOrder: 'asc' | 'desc'
};

export type Paginate = {
  pageSize: number;
  offset: number;
};

export type DataTableCriteria = Omit<DataTableFilter, 'columns'> & { columns: string[] };
