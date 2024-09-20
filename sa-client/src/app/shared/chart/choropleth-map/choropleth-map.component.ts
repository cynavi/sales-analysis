import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
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

@Component({
  selector: 'app-choropleth-map',
  standalone: true,
  imports: [CurrencyPipe, ProgressSpinnerModule, CardModule, AccordionModule],
  providers: [ChoroplethMapService, ChoroplethMapStore],
  template: `
    <p-accordion [activeIndex]="0" [styleClass]="'w-full mt-4'">
      <p-accordionTab header="Choropleth Visualiztion">
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
export class ChoroplethMapComponent {

  currencyPipe = inject(CurrencyPipe);
  choroplethMapStore = inject(ChoroplethMapStore);

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

  constructor() {
    effect(() => {
      if (this.choroplethMapStore.loaded()) {
        this.prepareChart();
      }
    });
  }

  prepareChart(): void {
    this.svg = d3.select("#choropleth-map")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "400px")
      .attr("viewBox", "0 0  450 350")
      .attr("class", "flex xy-center");
    this.polygon = this.svg.append("g");
    this.lines = this.svg.append("g");
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
}
