import { Component } from '@angular/core';
import { ChoroplethMapComponent } from '../shared/chart/choropleth-map/choropleth-map.component';
import { DataGridComponent } from '../shared/data-grid/data-grid.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ChoroplethMapComponent,
    DataGridComponent
  ],
  template: `
    <app-choropleth-map></app-choropleth-map>
    <app-data-grid></app-data-grid>
  `
})
export class HomeComponent {
}

