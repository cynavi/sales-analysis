import { Component } from '@angular/core';
import { ChoroplethMapComponent } from '../shared/chart/choropleth-map/choropleth-map.component';
import { DataTableComponent } from '../shared/data-table/data-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ChoroplethMapComponent,
    DataTableComponent
  ],
  template: `
    <app-choropleth-map></app-choropleth-map>
    <app-data-grid></app-data-grid>
  `
})
export class HomeComponent {
}

