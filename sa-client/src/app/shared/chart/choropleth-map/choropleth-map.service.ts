import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Topology } from 'topojson-specification';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../model/api-response';

@Injectable()
export class ChoroplethMapService {

  #httpClient = inject(HttpClient);

  fetchWorldPolygon(): Observable<Topology> {
    return this.#httpClient.get<Topology>('http://localhost:8081/world-polygons.json');
  }

  fetchWorldLines(): Observable<Topology> {
    return this.#httpClient.get<Topology>('http://localhost:8081/world-lines.json');
  }

  fetchSalesData(): Observable<ApiResponse<Map<string, number>[]>> {
    return this.#httpClient.get<ApiResponse<Map<string, number>[]>>('http://localhost:8081/overall-sales.json');
  }
}
