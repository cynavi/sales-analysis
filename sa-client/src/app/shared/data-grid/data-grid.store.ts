import { Column, ColumnFilter, DataGridCriteria, Filter, Paginate, Sort } from './data-grid';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { DataGridService } from './data-grid.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { ApiResponse } from '../model/api-response';
import { mapColumnsToColumnNames } from './data-grid.util';

type DataGridState = {
  data: Record<string, number | string | Date>[];
  recordCount: number;
  filter: Filter;
  columns: Column[];
  paginate: Paginate;
  loaded: boolean;
  error: Error | null;
};

const initialState: DataGridState = {
  data: [],
  recordCount: 0,
  filter: {
    columnFilters: [],
    sorts: [],
    columns: []
  },
  paginate: {
    pageSize: 10,
    offset: 0
  },
  loaded: false,
  columns: [],
  error: null
};

export const DataGridStore = signalStore(
  withDevtools('dataGrid'),
  withState(initialState),
  withMethods(store => ({
    setColumnFilter(columnFilters: ColumnFilter[]) {
      patchState(store, state => ({
        filter: {
          ...state.filter,
          columnFilters: [...columnFilters]
        }
      }));
    },

    setSorts(sorts: Sort[]) {
      patchState(store, state => ({
        filter: {
          ...state.filter,
          sorts: [...sorts]
        }
      }));
    },

    setSelectedColumns(cols: Column[]) {
      patchState(store, state => ({ filter: { ...state.filter, columns: cols } }));
    },

    setPaginate(paginate: Paginate) {
      patchState(store, () => ({ paginate }));
    },

    clearFilters() {
      patchState(store, state => ({
        filter: {
          ...state.filter,
          sorts: [],
          columnFilters: []
        }
      }));
    }
  })),
  withMethods(store => ({
    _setLoading() {
      patchState(store, { loaded: false, error: null });
    },

    _setError(error: Error) {
      patchState(store, { loaded: true, error });
    },

    _setData(data: Record<string, number | string | Date>[]) {
      patchState(store, () => ({ loaded: true, data }));
    },

    _setColumns(columns: Column[]) {
      patchState(store, state => ({ columns, filter: { ...state.filter, columns } }));
    },

    _setRecordCount(recordCount: number) {
      patchState(store, () => ({ recordCount }));
    }
  })),
  // TODO: handle response error
  withMethods((store, dataGridService = inject(DataGridService)) => ({
    getDataGridData: rxMethod<DataGridCriteria>(
      pipe(
        tap(() => store._setLoading()),
        switchMap((criteria) => dataGridService.getData(criteria)),
        tap({
          next(response: ApiResponse<Record<string, number | string | Date>[]>) {
            store._setData(response.data);
          },
          error(error: Error) {
            store._setError(error);
          }
        })
      )
    ),

    _initialLoad: rxMethod<void>(
      pipe(
        tap(() => store._setLoading()),
        switchMap(() => dataGridService.getColumns()),
        tap({
          next(response: ApiResponse<Column[]>) {
            store._setColumns(response.data);
          },
          error(error: Error) {
            store._setError(error);
          }
        }),
        switchMap(() => dataGridService.getRecordCount()),
        tap({
          next(response) {
            store._setRecordCount(response.data.recordCount);
          },
          error(error: Error) {
            store._setError(error);
          }
        }),
        switchMap(() => dataGridService.getData({
          filter: { ...store.filter(), columns: mapColumnsToColumnNames(store.columns()) },
          paginate: store.paginate()
        })),
        tap({
          next(response: ApiResponse<Record<string, number | string | Date>[]>) {
            store._setData(response.data);
          },
          error(error: Error) {
            store._setError(error);
          }
        })
      )
    )
  })),
  withHooks({
    onInit(store) {
      store._initialLoad();
    }
  })
);
