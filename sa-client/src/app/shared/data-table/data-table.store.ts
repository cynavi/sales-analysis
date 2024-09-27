import { computed, inject, Injectable } from '@angular/core';
import { Column, DataTableCriteria, DataTableFilter } from './data-table';
import { DataTableService } from './data-table.service';
import { patchState, signalState } from '@ngrx/signals';
import { filter, map, pipe, Subject, switchMap, tap } from 'rxjs';
import { mapColumnsToColumnNames } from './data-grid.util';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ApiResponse } from '../model/api-response';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type DataTableState = {
  rowData: Record<string, number | string | Date>[];
  recordCount: number;
  dataTableFilter: DataTableFilter;
  columns: Column[];
  loaded: boolean;
  error: Error | null;
};

const initialState: DataTableState = {
  rowData: [],
  recordCount: 0,
  dataTableFilter: {
    filters: [],
    sorts: [],
    columns: [],
    paginate: {
      pageSize: 100,
      offset: 0
    }
  },
  loaded: false,
  columns: [],
  error: null
};

@Injectable()
export class DataTableStore {

  readonly #dataTableService = inject(DataTableService);
  readonly #state = signalState<DataTableState>(initialState);

  readonly rowData = this.#state.rowData;
  readonly recordCount = this.#state.recordCount;
  readonly dataTableFilter = this.#state.dataTableFilter;
  readonly loaded = this.#state.loaded;
  readonly columns = this.#state.columns;
  readonly error = this.#state.error;

  sorts$ = new Subject<DataTableFilter['sorts']>();
  columnFilters$ = new Subject<DataTableFilter['filters']>();
  columns$ = new Subject<DataTableFilter['columns']>();
  paginate$ = new Subject<DataTableFilter['paginate']>();

  #initialLoad = rxMethod<void>(
    pipe(
      tap(() => this.setLoading()),
      switchMap(() => this.#dataTableService.getColumns()),
      tap({
        next: response => patchState(this.#state, state => ({
          columns: response.data,
          dataTableFilter: { ...state.dataTableFilter, columns: response.data }
        })),
        error: err => this.setError(err)
      }),
      switchMap(() => this.#dataTableService.getRecordCount()),
      tap({
        next: response => patchState(this.#state, { recordCount: response.data.recordCount }),
        error: err => this.setError(err)
      }),
      switchMap(() => this.#dataTableService.getData({
        ...this.#state.dataTableFilter(),
        columns: mapColumnsToColumnNames(this.#state.columns()),
      })),
      tap({
        next: (response: ApiResponse<DataTableState['rowData']>) => this.setRowData(response.data),
        error: err => this.setError(err)
      })
    )
  );

  #fetch = rxMethod<DataTableFilter>(
    pipe(
      filter(dataTableFilter => !!dataTableFilter.columns.length),
      tap(() => this.setLoading()),
      map((dataTableFilter): DataTableCriteria => ({
        ...dataTableFilter,
        columns: mapColumnsToColumnNames(dataTableFilter.columns),
      })),
      switchMap(criteria => this.#dataTableService.getData(criteria)),
      tap({
        next: (response: ApiResponse<DataTableState['rowData']>) => this.setRowData(response.data),
        error: err => this.setError(err)
      })
    )
  );

  constructor() {
    this.#initialLoad();
    this.#fetch(computed(() => this.#state.dataTableFilter()));
    this.sorts$
      .pipe(takeUntilDestroyed())
      .subscribe(sorts => patchState(this.#state, state => ({ dataTableFilter: { ...state.dataTableFilter, sorts } })));
    this.columns$
      .pipe(takeUntilDestroyed())
      .subscribe(columns => patchState(this.#state, state => ({
        dataTableFilter: {
          ...state.dataTableFilter,
          columns
        }
      })));
    this.columnFilters$
      .pipe(takeUntilDestroyed())
      .subscribe(filters => patchState(this.#state, state => ({
        dataTableFilter: {
          ...state.dataTableFilter,
          filters
        }
      })));
    this.paginate$
      .pipe(takeUntilDestroyed())
      .subscribe(paginate => patchState(this.#state, state => ({
        dataTableFilter: {
          ...state.dataTableFilter,
          paginate
        }
      })));
  }

  private setRowData(rowData: DataTableState['rowData']): void {
    patchState(this.#state, () => ({ loaded: true, rowData }));
  }

  private setLoading(): void {
    patchState(this.#state, { loaded: false, error: null });
  }

  private setError(error: Error): void {
    patchState(this.#state, { loaded: true, error });
  }
}
