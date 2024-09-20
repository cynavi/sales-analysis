import { Topology } from 'topojson-specification';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { subYears } from 'date-fns';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, zipWith } from 'rxjs';
import { inject } from '@angular/core';
import { ChoroplethMapService } from './choropleth-map.service';

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
    from: subYears(new Date(), 1),
    to: new Date()
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
    _initialLoad: rxMethod<void>(
      pipe(
        tap(() => store._setLoading()),
        zipWith(
          choroplethMapService.fetchWorldPolygon(),
          choroplethMapService.fetchWorldLines(),
          choroplethMapService.fetchSalesData()
        ),
        tap({
          next(response) {
            patchState(store, state => ({
              ...state,
              worldPolygons: response[1],
              worldLines: response[2],
              data: response[3].data,
              loaded: true,
              error: null
            }))
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
)
