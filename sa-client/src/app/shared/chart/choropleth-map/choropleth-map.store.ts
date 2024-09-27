import { Topology } from 'topojson-specification';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, zipWith } from 'rxjs';
import { computed, inject } from '@angular/core';
import { ChoroplethMapService } from './choropleth-map.service';
import { ApiResponse } from '../../model/api-response';

type ChoroplethMapState = {
  data: Map<string, number>[];
  worldLines: Topology | null;
  worldPolygons: Topology | null;
  filter: {
    from: Date;
    to: Date;
  };
  loaded: boolean;
  error: Error | null;
};

const initialState: ChoroplethMapState = {
  data: [],
  worldLines: null,
  worldPolygons: null,
  filter: {
    from: new Date(2010, 12, 1),
    to: new Date(2011, 12, 9)
  },
  loaded: true,
  error: null
};

export const ChoroplethMapStore = signalStore(
  withDevtools("choroplethMap"),
  withState(initialState),
  withMethods(store => ({
    setFilter(filter: { from: Date; to: Date; }) {
      patchState(store, () => ({ filter }));
    }
  })),
  withMethods(store => ({
    _setData(data: Map<string, number>[]) {
      patchState(store, () => ({ data, loaded: true, error: null }));
    },

    _setError(error: Error) {
      patchState(store, () => ({ loaded: true, error: error }));
    },

    _setLoading() {
      patchState(store, () => ({ loaded: false, error: null }));
    }
  })),
  withMethods((store, choroplethMapService = inject(ChoroplethMapService)) => ({
    _loadWorldLinesAndPolygons: rxMethod<void>(
      pipe(
        tap(() => store._setLoading()),
        zipWith(
          choroplethMapService.fetchWorldPolygon(),
          choroplethMapService.fetchWorldLines(),
        ),
        tap({
          next(response) {
            patchState(store, state => ({
              ...state,
              worldPolygons: response[1],
              worldLines: response[2],
              loaded: false,
              error: null
            }));
          },
          error(error: Error) {
            store._setError(error);
          }
        })
      )
    ),

    _loadData: rxMethod<{ from: Date; to: Date }>(
      pipe(
        tap(() => store._setLoading()),
        switchMap((filter) => choroplethMapService.fetchSalesData(filter)),
        tap({
          next(response: ApiResponse<Map<string, number>[]>) {
            store._setData(response.data);
          },

          error(error: Error) {
            store._setError(error);
          }
        })
      ))
  })),
  withHooks({
    onInit(store) {
      store._loadWorldLinesAndPolygons();
      store._loadData(computed(() => store.filter()));
    }
  })
)
