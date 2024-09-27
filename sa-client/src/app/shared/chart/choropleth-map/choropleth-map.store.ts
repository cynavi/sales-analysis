import { inject, Injectable } from '@angular/core';
import { Topology } from 'topojson-specification';
import { patchState, signalState } from '@ngrx/signals';
import { ChoroplethMapService } from './choropleth-map.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, Subject, switchMap, tap, zipWith } from 'rxjs';
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

@Injectable()
export class ChoroplethMapStore {

  readonly #choroplethMapService = inject(ChoroplethMapService);
  readonly #state = signalState<ChoroplethMapState>(initialState);

  readonly data = this.#state.data;
  readonly worldLines = this.#state.worldLines;
  readonly worldPolygons = this.#state.worldPolygons;
  readonly loaded = this.#state.loaded;
  readonly error = this.#state.error;

  fetch$ = new Subject<{ from: Date; to: Date; }>();

  #loadData = rxMethod<{ from: Date; to: Date }>(
    pipe(
      tap(() => this.setLoading()),
      switchMap(filter => this.#choroplethMapService.fetchSalesData(filter)),
      tap({
        next: (response: ApiResponse<Map<string, number>[]>) => patchState(this.#state, () => ({
          data: response.data,
          loaded: true,
          error: null
        })),
        error: err => this.setError(err)
      })
    ));

  #loadWorldPolygonsAndLines = rxMethod<void>(
    pipe(
      tap(() => this.setLoading()),
      zipWith(
        this.#choroplethMapService.fetchWorldPolygon(),
        this.#choroplethMapService.fetchWorldLines(),
        this.#choroplethMapService.fetchSalesData(this.#state.filter()),
      ),
      tap({
        next: response => patchState(this.#state, state => ({
          ...state,
          worldPolygons: response[1],
          worldLines: response[2],
          data: response[3].data,
          loaded: true,
          error: null
        })),
        error: err => this.setError(err)
      })
    )
  );

  constructor() {
    this.#loadWorldPolygonsAndLines();
    this.#loadData(this.fetch$);
  }

  private setError(error: Error) {
    patchState(this.#state, () => ({ loaded: true, error: error }));
  }

  private setLoading() {
    patchState(this.#state, () => ({ loaded: false, error: null }));
  }
}
