# Sales Analysis
Processes, visualizes, and allows export to CSV using Angular, Spring Boot, Apache Kafka, Socket, and PostgreSQL
for transactions occurring between 2010 Dec 01 and 2011 Des 09 for a UK-based and registered non-store online retail.

## Tech Stack
- TypeScript
- Angular - Used for building client side SPA
- Primeng - Used for creating data table
- D3.js - Used for creating the choropleth map to visualize sales
- Java
- Kafka - Message system to handle CSV export requests
- Socket - Communication channel between client and service for streaming sales analysis report in CSV
- Spring Boot: Used for building REST APIs, Kafka producers, and consumers
- Spring Batch: Used for loading sales datasets into PostgreSQL
- PostgreSQL - Used for storing sales data and CSV exports information

## Project Structure

## sa-client
Client application for sa-client. Features a choropleth map built using D3.js that visualizes total sales by country
and a comprehensive data table showing sales data.

## sa-assets
A static server for serving world polygons and world line data used in the choropleth map.

## sa-commons
A shared Java library that holds domain records used across different services (e.g., sa-producer, 

## sa-batch-processor
A Spring Batch application that ingests an online retail sales dataset into PostgreSQL.

## sa-producer
A Spring Boot application with Kafka producer that sends CSV export requests to a Kafka topic (sales-csv)
and stores these requests in PostgreSQL.

## sa-service
A Spring Boot application with a Kafka consumer that processes CSV export requests from the Kafka topic. It builds
queries based on the request and sends the CSV file via SocketJS. It is also the main API provider for the 
sa-client data table.

## Running Application Locally

## Prerequisites
Before you fire up dev server, you need to have following
- Kafka
- Java (at least JDK 21)
- Node.js (at least ^18.19.1)
- PostgreSQL 

## 1. Clone the repository
```bash
git clone https://github.com/cynavi/sales-analysis.git
cd sales-analysis
```

## 2. Ingest dataset into postgresql
`sa-batch-processor` populates PostgreSQL database with sales data from `online-retail.xlsx`. This step might take
a while.
```bash
cd sa-batch-processor
./mvnw spring-boot:run
```

## 3. Install sa-commons Library
```bash
cd sa-commons
./mvnw install
```

Next steps can be executed in any order. Just make sure you have Kafka server up and running.

## 4. Run sa-producer application
```bash
cd sa-producer
./mvnw spring-boot:run
```

## 5. Run sa-service application
```bash
cd sa-service
./mvnw spring-boot:run
```

## 6. Run sa-assets
```bash
cd sa-assets
npm install
npm start
```

## 7. Run sa-client
```bash
cd sa-client
npm install
ng s
```

## 8. Open the app in your browser
Visit http://localhost:4200 in your browser.

## Running with docker compose

## Clone the repository
```bash
git clone https://github.com/cynavi/sales-analysis.git
cd sales-analysis
```

## Run docker compose
```bash
docker-compose up --build
```
## Open the app in your browser
Visit http://localhost:4200 in your browser.

Happy coding :)