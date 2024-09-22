import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Column, DataGridCriteria, DataTableFilter } from './data-grid';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api-response';
import { environment } from '../../../environment';

@Injectable()
export class DataGridService {

  #httpClient = inject(HttpClient);

  getData(criteria: DataGridCriteria): Observable<ApiResponse<Record<string, number | string | Date>[]>> {
    return this.#httpClient.post<ApiResponse<Record<string, number | string | Date>[]>>(`${environment.serviceUrl}/sales`, criteria);
  }

  getColumns(): Observable<ApiResponse<Column[]>> {
    return this.#httpClient.get<ApiResponse<Column[]>>(`${environment.serviceUrl}/columns`);
  }

  getRecordCount(): Observable<ApiResponse<{ recordCount: number }>> {
    return this.#httpClient.get<ApiResponse<{ recordCount: number }>>(`${environment.serviceUrl}/sales/count`);
  }

  generateCsv(dataTableFilter: DataTableFilter) {
    return this.#httpClient.post(`${environment.producerUrl}/generate`, dataTableFilter);
  }
}
