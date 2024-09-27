import { inject, Injectable } from '@angular/core';
import { Column, DataTableCriteria, DataTableFilter } from './data-table';
import { DataTableService } from './data-table.service';
import { patchState, signalState } from '@ngrx/signals';
import { filter, map, pipe, Subject, switchMap, tap } from 'rxjs';
import { mapColumnsToColumnNames } from './data-grid.util';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ApiResponse } from '../model/api-response';

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

  fetch$ = new Subject<DataTableFilter>();

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
        dataTableFilter: { ...this.#state.dataTableFilter(), columns: mapColumnsToColumnNames(this.#state.columns()) },
        paginate: this.#state.dataTableFilter.paginate()
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
        dataTableFilter: {
          ...dataTableFilter,
          columns: mapColumnsToColumnNames(dataTableFilter.columns)
        },
        paginate: dataTableFilter.paginate
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
    this.#fetch(this.fetch$);
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
