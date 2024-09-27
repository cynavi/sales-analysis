import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CardModule,
    PanelModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  readonly keyFeatures: { title: string; description: string }[] = [
    { title: 'Sales Visualization', description: 'Interactive choropleth map showing sales data by country.' },
    {
      title: 'Sales Data Table',
      description: 'Comprehensive data table with sorting, filtering, and searching capabilities.'
    },
    { title: 'CSV Export', description: 'Processed sales data is displayed instantly using Apache Kafka.' },
  ];

  readonly techStacks: { title: string; description: string }[] = [
    { title: 'TypeScript', description: '' },
    { title: 'Angular', description: 'Used for building client side SPA' },
    { title: 'Primeng', description: 'Used for creating data table' },
    { title: 'D3.js', description: 'Used for creating the choropleth map to visualize sales' },
    { title: 'Java', description: '' },
    { title: 'Kafka', description: 'Message system to handle CSV export requests' },
    {
      title: 'Socket',
      description: 'Communication channel between client and service for streaming sales analysis report in CSV'
    },
    { title: 'Spring Boot', description: 'Used for building REST APIs, Kafka producers, and consumers' },
    { title: 'Spring Batch', description: 'Used for loading sales datasets into PostgreSQL' },
    { title: 'PostgreSQL', description: 'Used for storing sales data and CSV exports information' }
  ];

  readonly architecture: { title: string; description: string }[] = [
    {
      title: 'sa-client',
      description: 'Client application for sa-client. Features a choropleth map built using D3.js that visualizes total' +
        ' sales by country and a comprehensive data table showing sales data.'
    },

    {
      title: 'sa-assets',
      description: 'Server for serving static assets like world polygons and world line data used in the choropleth map.'
    },
    {
      title: 'sa-commons',
      description: 'A shared Java library that holds domain records used across different services.'
    },
    {
      title: 'sa-batch-processor',
      description: 'A Spring Batch application that ingests an online retail sales dataset into PostgreSQL.'
    },
    {
      title: 'sa-producer',
      description: 'A Spring Boot application with Kafka producer that sends CSV export requests to a Kafka ' +
        'topic(sales - csv) and stores these requests in PostgreSQL.'
    },
    {
      title: 'sa-service',
      description: 'A Spring Boot application with a Kafka consumer that processes CSV export requests from the Kafka' +
        ' topic.It buildsqueries based on the request and sends the CSV file via SocketJS.It is also the main API ' +
        'provider for thesa-client data table.'
    }
  ];

}
