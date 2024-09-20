import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as d3Projection from 'd3-geo-projection';
import * as GeoJSON from 'geojson';
import { CurrencyPipe } from '@angular/common';
import { ChoroplethMapService } from './choropleth-map.service';
import { ChoroplethMapStore } from './choropleth-map.store';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { skip, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-choropleth-map',
  standalone: true,
  imports: [CurrencyPipe, ProgressSpinnerModule, CardModule, AccordionModule, CalendarModule, FormsModule],
  providers: [ChoroplethMapService, ChoroplethMapStore],
  template: `
    <p-accordion [activeIndex]="0" [styleClass]="'w-full mt-4'">
      <p-accordionTab class="text-xl" header="Choropleth Visualiztion">
        <div>
          <p-calendar
            [(ngModel)]="dateRange"
            selectionMode="range"
            [readonlyInput]="true"
            [iconDisplay]="'input'"
            placeholder="Date Range"
            [showIcon]="true"
            (onSelect)="onFilter()"
          />
        </div>
        <div class="w-full" id="choropleth-map"></div>
        @if (!choroplethMapStore.loaded()) {
          <p-progressSpinner
            styleClass="flex xy-center"
            strokeWidth="8"
            animationDuration=".5s"/>
        }
      </p-accordionTab>
    </p-accordion>
  `,
  styleUrl: './choropleth-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChoroplethMapComponent implements OnInit {

  currencyPipe = inject(CurrencyPipe);
  choroplethMapStore = inject(ChoroplethMapStore);

  dateRange: Date[] = [];
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
  polygon: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;
  lines: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;
  color: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
  data: { [x: string]: unknown; } = {};
  width = 450;
  height = 350;
  projection = d3Projection.geoRobinson()
    .scale(85)
    .center([0, 0])
    .translate([this.width / 2.2, this.height / 2]);
  path: d3.GeoPath<unknown, d3.GeoPermissibleObjects> = d3.geoPath().projection(this.projection);
  data$ = toObservable(computed(() => this.choroplethMapStore.filter())).pipe(
    skip(1),
    switchMap(async () => this.choroplethMapStore.getData())
  );
  unsubscribe$ = new Subject<void>();

  constructor() {
    effect(() => {
      if (this.choroplethMapStore.loaded() && !this.choroplethMapStore.error()) {
        this.prepareChart();
      }
    });
    inject(DestroyRef).onDestroy(() => {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    });
  }

  ngOnInit() {
    this.data$.pipe(takeUntil(this.unsubscribe$)).subscribe();
    this.svg = d3.select("#choropleth-map")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "400px")
      .attr("viewBox", "0 0  450 350")
      .attr("class", "flex xy-center");
    this.polygon = this.svg.append("g");
    this.lines = this.svg.append("g");
  }

  prepareChart(): void {
    console.log('preparing chart');
    const max = this.choroplethMapStore.data().reduce((prev, current) => prev['totalSales'] > current['totalSales'] ? prev : current);
    const min = this.choroplethMapStore.data().reduce((prev, current) => prev['totalSales'] > current['totalSales'] ? current : prev);
    this.color = (d3.scaleThreshold()
      .domain([min['totalSales'], max['totalSales']]) as any)
      .range(["#DCE9FF", "#8EBEFF", "#589BE5", "#0072BC"])
      .unknown("#E6E6E6");
    this.choroplethMapStore.data().forEach(s => this.data[s['countryCode']] = s['totalSales']);
    this.drawPolygons();
    this.drawPolyLines();
    this.prepareZoom();
  }

  drawPolyLines(): void {
    const featureCollection = topojson.feature(
      this.choroplethMapStore.worldLines(),
      this.choroplethMapStore.worldLines().objects['world_lines_simplified']
    ) as GeoJSON.FeatureCollection;
    this.lines
      .selectAll("path")
      .data(featureCollection.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .style("fill", "none")
      .attr("class", d => d.properties['type']);
  }

  drawPolygons(): void {
    const featureCollection = topojson.feature(
      this.choroplethMapStore.worldPolygons(),
      this.choroplethMapStore.worldPolygons().objects['world_polygons_simplified']
    ) as GeoJSON.FeatureCollection;
    this.polygon
      .selectAll("path")
      .data(featureCollection.features)
      .join("path")
      .attr("fill", (d) => (this.color as any)(d['totalSales'] = this.data[d.properties['color_code']]))
      .attr("d", this.path)
      .attr("id", (d) => d.properties['iso3'])
      .attr("class", () => "countries")
      .on("mouseover", (_, d) => {
        d3.selectAll(".countries")
          .transition()
          .duration(100)
          .style("opacity", .3)
        d3.select(`#${d.properties['iso3']}`)
          .transition()
          .duration(100)
          .style("opacity", 1)
      })
      .on("mouseleave", (_, d) => {
        d3.selectAll(".countries")
          .transition()
          .duration(100)
          .style("opacity", 1)
        d3.select(`#${d.properties['iso3']}`)
          .transition()
          .duration(100)
          .style("opacity", 1)
      })
      .append("title")
      .text((d) => `${d.properties['gis_name']} \nTotal Sales: ${this.currencyPipe.transform(d['totalSales'] ?? 0)}`);
  }

  prepareZoom() {
    const zoomFunction = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        this.polygon.selectAll('path')
          .attr('transform', event.transform);
        this.lines.selectAll('path')
          .attr('transform', event.transform);
      });
    this.svg.call(zoomFunction);
  }

  onFilter(): void {
    const from = this.dateRange[0], to = this.dateRange[1];
    if (from && to) {
      this.choroplethMapStore.setFilter({ from, to });
    }
  }
}
