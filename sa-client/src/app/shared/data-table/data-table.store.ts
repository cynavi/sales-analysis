import { Column, ColumnFilter, DataTableCriteria, DataTableFilter, Paginate, Sort } from './data-table';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { DataTableService } from './data-table.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { ApiResponse } from '../model/api-response';
import { mapColumnsToColumnNames } from './data-grid.util';

type DataTableState = {
  data: Record<string, number | string | Date>[];
  recordCount: number;
  dataTableFilter: DataTableFilter;
  columns: Column[];
  loaded: boolean;
  error: Error | null;
};

const initialState: DataTableState = {
  data: [],
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

export const DataTableStore = signalStore(
  withDevtools('dataTable'),
  withState(initialState),
  withMethods(store => ({
    setColumnFilter(columnFilters: ColumnFilter[]) {
      patchState(store, state => ({
        dataTableFilter: {
          ...state.dataTableFilter,
          filters: columnFilters
        }
      }));
    },

    setSorts(sorts: Sort[]) {
      patchState(store, state => ({
        dataTableFilter: {
          ...state.dataTableFilter,
          sorts: [...sorts]
        }
      }));
    },

    setSelectedColumns(cols: Column[]) {
      patchState(store, state => ({ dataTableFilter: { ...state.dataTableFilter, columns: cols } }));
    },

    setPaginate(paginate: Paginate) {
      patchState(store, (state) => ({ dataTableFilter: { ...state.dataTableFilter, paginate } }));
    },

    clearFilters() {
      patchState(store, state => ({
        dataTableFilter: {
          ...state.dataTableFilter,
          sorts: [],
          dataTableFilter: initialState.dataTableFilter
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
      patchState(store, state => ({ columns, dataTableFilter: { ...state.dataTableFilter, columns } }));
    },

    _setRecordCount(recordCount: number) {
      patchState(store, () => ({ recordCount }));
    }
  })),
  // TODO: handle response error
  withMethods((store, dataTableService = inject(DataTableService)) => ({
    _loadData: rxMethod<DataTableCriteria>(
      pipe(
        filter(criteria => !!criteria.columns.length),
        tap(() => store._setLoading()),
        switchMap((criteria) => dataTableService.getData(criteria)),
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

    _loadColumnsAndRecordCount: rxMethod<void>(
      pipe(
        tap(() => store._setLoading()),
        switchMap(() => dataTableService.getColumns()),
        tap({
          next(response: ApiResponse<Column[]>) {
            store._setColumns(response.data);
          },
          error(error: Error) {
            store._setError(error);
          }
        }),
        switchMap(() => dataTableService.getRecordCount()),
        tap({
          next(response: ApiResponse<{ recordCount: number }>) {
            store._setRecordCount(response.data.recordCount);
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
      store._loadColumnsAndRecordCount();
      store._loadData(computed(() => ({
        columns: mapColumnsToColumnNames(store.dataTableFilter.columns()),
        filters: store.dataTableFilter.filters(),
        sorts: store.dataTableFilter.sorts(),
        paginate: store.dataTableFilter.paginate()
      })));
    }
  })
);
