package cyn.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cyn.domain.Criteria;
import cyn.domain.DataExportRequest;
import cyn.entity.Report;
import cyn.domain.Status;
import cyn.repository.SaleRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SalesService {

    private static final Logger logger = LoggerFactory.getLogger(SalesService.class);
    private final SaleRepository saleRepository;
    private final ReportService reportService;
    private final ObjectMapper objectMapper;
    @Value("${csv.extracts.path}")
    private String path;

    public SalesService(SaleRepository saleRepository, ReportService reportService) {
        this.saleRepository = saleRepository;
        this.objectMapper = new ObjectMapper();
        this.reportService = reportService;
    }

    public void processCSVRequest(ConsumerRecord<String, String> consumerRecord) {
        try {
            var dataExportRequest = objectMapper.readValue(consumerRecord.value(), DataExportRequest.class);
            var query = buildQuery(dataExportRequest);
            var salesData = saleRepository.getSalesCSVData(query, dataExportRequest.columns(), new HashMap<>());
            var csvFilePath = path + dataExportRequest.name() + ".csv";
            writeAndSaveCSVReport(csvFilePath, dataExportRequest.columns(), salesData);
            saveJob(csvFilePath, query);
        } catch (JsonProcessingException e) {
            logger.error("Error occurred trying to parse consumer record", e);
        }
    }

    public List<Map<String, Object>> getSalesData(Criteria criteria) {
        var query = new StringBuilder("select ");
        criteria.filter().columns().forEach(col -> query.append(col).append(", "));
        query.deleteCharAt(query.lastIndexOf(","));
        query.append(" from sale ");
        if (criteria.filter().sorts() != null && !criteria.filter().sorts().isEmpty()) {
            query.append(" order by ");
            criteria.filter().sorts().forEach(sort -> query.append(sort.column())
                    .append(" ")
                    .append(sort.sortOrder())
                    .append(", "));
            query.deleteCharAt(query.lastIndexOf(","));
        }
        query.append(" limit ")
                .append(criteria.paginate().pageSize())
                .append(" offset ")
                .append(criteria.paginate().offset());
        return saleRepository.getSalesData(query.toString(), criteria.filter().columns(), Map.of());
    }

    public Integer getRecordCount() {
        return this.saleRepository.getRecordCount();
    }

    private void writeAndSaveCSVReport(String path, List<String> columns, List<List<Object>> salesData) {
        try {
            var csvFormat = CSVFormat.DEFAULT
                    .builder()
                    .setHeader(columns.toArray(String[]::new))
                    .build();
            var writer = Files.newBufferedWriter(Paths.get(path));
            var csvPrinter = new CSVPrinter(writer, csvFormat);
            logger.info("Attempting to write csv data in path {}", path);
            salesData.forEach(sale -> {
                try {
                    csvPrinter.printRecord(sale);
                } catch (IOException e) {
                    logger.error("Error occurred trying to write csv", e);
                }
            });
            csvPrinter.flush();
            logger.info("Completed writing sales data to csv in path {}", path);
        } catch (IOException e) {
            logger.error("Error occurred trying to write csv", e);
        }
    }

    private String buildQuery(DataExportRequest dataExportRequest) {
        var query = new StringBuilder("select ");
        dataExportRequest.columns().forEach(col -> query.append(col).append(", "));
        query.deleteCharAt(query.lastIndexOf(","));
        query.append(" from sale order by ");
        dataExportRequest.sorts().forEach(sort -> query
                .append(sort.column())
                .append(" ")
                .append(sort.sortOrder())
                .append(", "));
        query.deleteCharAt(query.lastIndexOf(","));
        query.append(" limit 100");
        return query.toString();
    }

    private void saveJob(String path, String query) {
        var job = new Report();
        job.setPath(path);
        job.setQuery(query);
        job.setStatus(Status.READY);
        reportService.save(job);
    }
}
