import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Topology } from 'topojson-specification';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../model/api-response';
import { environment } from '../../../../environment';

@Injectable()
export class ChoroplethMapService {

  #httpClient = inject(HttpClient);

  fetchWorldPolygon(): Observable<Topology> {
    return this.#httpClient.get<Topology>(`${environment.assetsUrl}/world-polygons.json`);
  }

  fetchWorldLines(): Observable<Topology> {
    return this.#httpClient.get<Topology>(`${environment.assetsUrl}/world-lines.json`);
  }

  fetchSalesData(filter: {from: Date; to: Date}): Observable<ApiResponse<Map<string, number>[]>> {
    return this.#httpClient.post<ApiResponse<Map<string, number>[]>>(`${environment.serviceUrl}/sales/overall`, filter);
  }
}
