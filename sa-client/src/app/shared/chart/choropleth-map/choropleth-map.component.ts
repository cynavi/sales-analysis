import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as d3Projection from 'd3-geo-projection';
import * as d3Legend from 'd3-svg-legend';
import * as GeoJSON from 'geojson';
import { CurrencyPipe } from '@angular/common';
import { ChoroplethMapService } from './choropleth-map.service';
import { ChoroplethMapStore } from './choropleth-map.store';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { skip, switchMap } from 'rxjs';
import { format } from 'date-fns';

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
            [minDate]="allowedRange[0]"
            [maxDate]="allowedRange[1]"
          />
        </div>
        @if (choroplethMapStore.loaded()) {
          @if (!choroplethMapStore.data().length) {
            <div class="w-full flex xy-center" style="height: 400px;">No transaction occurred on selected dates</div>
          }
        } @else {
          <div class="w-full flex xy-center" style="height: 400px;">
            <p-progressSpinner
              styleClass="w-full flex xy-center"
              strokeWidth="8"
              animationDuration=".5s"/>
          </div>

        }
        <div class="w-full" id="choropleth-map"></div>
      </p-accordionTab>
    </p-accordion>
  `,
  styles: `
    :host ::ng-deep .p-progress-spinner-circle {
      stroke: var(--primary-color) !important;
    }

    .legend {
      font-size: 0.6rem;
      fill: rgba(255, 255, 255, 0.87);
    }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChoroplethMapComponent implements OnInit {

  currencyPipe = inject(CurrencyPipe);
  choroplethMapStore = inject(ChoroplethMapStore);

  dateRange: Date[] = [new Date(2010, 12, 1), new Date(2011, 12, 9)];
  allowedRange: [Date, Date] = [new Date(2010, 12, 1), new Date(2011, 12, 9)] as const;
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
  unused = toSignal(toObservable(computed(() => this.choroplethMapStore.filter())).pipe(
    skip(1),
    switchMap(async (filter) => this.choroplethMapStore.getData(filter))
  ));

  constructor() {
    effect(() => {
      d3.select('#choropleth-map').select('svg').remove();
      if (this.choroplethMapStore.data().length) {
        this.prepareChart();
      }
    });
  }

  ngOnInit() {

  }

  prepareChart(): void {
    this.svg = d3.select('#choropleth-map')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '400px')
      .attr('viewBox', '0 0  450 350')
      .attr('class', 'flex xy-center');
    this.polygon = this.svg.append('g');
    this.lines = this.svg.append('g');
    const max = this.choroplethMapStore.data().reduce((prev, current) => prev['totalSales'] > current['totalSales'] ? prev : current);
    this.color = (d3.scaleThreshold()
      .domain([50, 100, 200, 300, 500, 700, 1000, 5000, 10000, 20000, 50000, 100000, max['totalSales']]) as any)
      .range(['#00876c', '#41976e', '#66a671', '#88b475', '#aac27c', '#ccd087', '#eedd94', '#ecc67b', '#eaad67', '#e89459', '#e47951', '#dd5d4f', '#d43d51',])
      .unknown('#E6E6E6');
    this.choroplethMapStore.data().forEach(s => this.data[s['countryCode']] = s['totalSales']);
    this.drawPolygons();
    this.drawPolyLines();
    this.prepareZoom();
    this.prepareLegend();
  }

  drawPolyLines(): void {
    const featureCollection = topojson.feature(
      this.choroplethMapStore.worldLines(),
      this.choroplethMapStore.worldLines().objects['world_lines_simplified']
    ) as GeoJSON.FeatureCollection;
    this.lines
      .selectAll('path')
      .data(featureCollection.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .style('fill', 'none')
      .attr('class', d => d.properties['type']);
  }

  drawPolygons(): void {
    const featureCollection = topojson.feature(
      this.choroplethMapStore.worldPolygons(),
      this.choroplethMapStore.worldPolygons().objects['world_polygons_simplified']
    ) as GeoJSON.FeatureCollection;
    this.polygon
      .selectAll('path')
      .data(featureCollection.features)
      .join('path')
      .attr('fill', (d) => (this.color as any)(d['totalSales'] = this.data[d.properties['color_code']]))
      .attr('d', this.path)
      .attr('id', (d) => d.properties['iso3'])
      .attr('class', () => 'countries')
      .on('mouseover', (_, d) => {
        d3.selectAll('.countries')
          .transition()
          .duration(100)
          .style('opacity', .3);
        d3.select(`#${d.properties['iso3']}`)
          .transition()
          .duration(100)
          .style('opacity', 1);
      })
      .on('mouseleave', (_, d) => {
        d3.selectAll('.countries')
          .transition()
          .duration(100)
          .style('opacity', 1);
        d3.select(`#${d.properties['iso3']}`)
          .transition()
          .duration(100)
          .style('opacity', 1);
      })
      .append('title')
      .text((d) => `${d.properties['gis_name']} \nTotal Sales: ${this.currencyPipe.transform(d['totalSales'] ?? 0)}`);
  }

  prepareZoom(): void {
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

  prepareLegend(): void {
    this.svg.append('g')
      .attr('class', 'legendThreshold')
      .attr('transform', `translate(${window.innerWidth / 2 - 40},0)`);
    const enGB = d3.formatLocale({
      'decimal': '.',
      'thousands': ',',
      'grouping': [3],
      'currency': ['£', '']
    });
    const legend = d3Legend.legendColor()
      .labels(d3Legend.legendHelpers.thresholdLabels)
      .labelFormat(d3.format(',d'))
      .titleWidth(2)
      .labelOffset(2)
      .shapeHeight(10)
      .shapePadding(2)
      .scale(this.color);

    this.svg.select('.legendThreshold')
      .attr('font-size', 10)
      .attr('fill', 'rgba(255, 255, 255, 0.87)')
      .call(legend as any);

    /**
     * Falling back to this as defining d3.formatLocale() didn't work
     * d.replace(/(\d[\d,]*)/g, ...): This regular expression searches for numbers (including those with commas) in
     * the legend text. It replaces them with the properly formatted version, prefixed by £.
     *
     * +match.replace(/,/g, ''): Converts the matched number string back into a number (by removing commas) so
     * it can be formatted.
     *
     * Handles both numbers and text: For labels like "Less than 50" or "50 to 100", only the numeric part is formatted,
     * while the rest of the text stays intact.
     */
    d3.selectAll('.legendThreshold .legendCells .cell text')
      .text((d: string) => d.replace(/(\d[\d,]*)/g, (match: string) => '£' + enGB.format(',.0f')(+match.replace(/,/g, ''))));
    this.svg
      .append('text')
      .attr('x', this.width * 0.01)
      .attr('y', this.height * 0.96)
      .attr('text-anchor', 'start')
      .style('font-size', 10)
      .style('fill', 'rgba(255, 255, 255, 0.87)')
      .text(`Transactions occurring between ${format(this.dateRange[0], 'yyyy-MM-dd')} and
                ${format(this.dateRange[1], 'yyyy-MM-dd')} for a UK-based and registered non-store online retail`);

    this.svg
      .append('text')
      .attr('class', 'note')
      .attr('x', this.width * 0.01)
      .attr('y', this.height * 0.99)
      .attr('text-anchor', 'start')
      .style('fill', 'rgba(255, 255, 255, 0.87)')
      .style('font-size', 10)
      .text('**Few data are altered for learning purpose');
  }

  onFilter(): void {
    const from = this.dateRange[0], to = this.dateRange[1];
    if (from && to) {
      this.choroplethMapStore.setFilter({ from, to });
    }
  }
}
