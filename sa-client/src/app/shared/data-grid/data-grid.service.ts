import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Column, DataGridCriteria } from './data-grid';
import { Observable, of } from 'rxjs';
import { ApiResponse } from '../model/api-response';

@Injectable()
export class DataGridService {

  #httpClient = inject(HttpClient);

  getData(criteria: DataGridCriteria): Observable<ApiResponse<Record<string, number | string | Date>[]>> {
    // return this.#httpClient.post<ApiResponse<Record<string, number | string | Date>[]>>(`http://localhost:8081/sales`, criteria);
    return this.#httpClient.get<ApiResponse<Record<string, number | string | Date>[]>>(`http://localhost:8081/data.json`);
  }

  getColumns(): Observable<ApiResponse<Column[]>> {
    return this.#httpClient.get<ApiResponse<Column[]>>(`http://localhost:8081/columns.json`);
    // return this.#httpClient.get<ApiResponse<Column[]>>(`http://localhost:8081/columns`);
  }

  getRecordCount(): Observable<ApiResponse<{ recordCount: number }>> {
    // return this.#httpClient.get<ApiResponse<{ recordCount: number }>>('http://localhost:8081/sales/count');
    return of({ data: { recordCount: 543323 } });
  }
}
