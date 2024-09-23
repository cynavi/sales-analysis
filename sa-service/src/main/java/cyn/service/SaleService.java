package cyn.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cyn.domain.Criteria;
import cyn.domain.DataExportRequest;
import cyn.domain.SaleOverallFilter;
import cyn.domain.Status;
import cyn.entity.Report;
import cyn.repository.SaleRepository;
import cyn.util.FilterUtil;
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
public class SaleService {

    private static final Logger logger = LoggerFactory.getLogger(SaleService.class);
    private final SaleRepository saleRepository;
    private final ReportService reportService;
    private final ObjectMapper objectMapper;
    @Value("${csv.extracts.path}")
    private String path;

    public SaleService(SaleRepository saleRepository, ReportService reportService) {
        this.saleRepository = saleRepository;
        this.objectMapper = new ObjectMapper();
        this.reportService = reportService;
    }

    public void processCSVRequest(ConsumerRecord<String, String> consumerRecord) {
        try {
            var dataExportRequest = objectMapper.readValue(consumerRecord.value(), DataExportRequest.class);
            var criteria = new Criteria(dataExportRequest.dataTableFilter(), null);
            var params = new HashMap<String, Object>();
            var query = buildQuery(criteria, params, true);
            var salesData = saleRepository.getSalesCSVData(query, criteria.dataTableFilter().columns(), new HashMap<>());
            var csvFilePath = path + dataExportRequest.id() + ".csv";
            writeAndSaveCSVReport(csvFilePath, criteria.dataTableFilter().columns(), salesData);
            saveJob(csvFilePath, query);
        } catch (JsonProcessingException e) {
            logger.error("Error occurred trying to parse consumer record", e);
        }
    }

    public List<Map<String, Object>> getSalesData(Criteria criteria) {
        var params = new HashMap<String, Object>();
        var query = buildQuery(criteria, params, false);
        return saleRepository.getSalesData(query, criteria.dataTableFilter().columns(), params);
    }

    public Integer getRecordCount() {
        return this.saleRepository.getRecordCount();
    }

    public List<Map<String, Object>> getOverallSales(SaleOverallFilter saleOverallFilter) {
        return saleRepository.getSalesOverall(saleOverallFilter);

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

    private void saveJob(String path, String query) {
        var job = new Report();
        job.setPath(path);
        job.setQuery(query);
        job.setStatus(Status.READY);
        reportService.save(job);
    }

    private String buildQuery(Criteria criteria, Map<String , Object> params, boolean isDataExport) {
        var query = new StringBuilder("select ");
        criteria.dataTableFilter().columns().forEach(col -> query.append(col).append(", "));
        query.deleteCharAt(query.lastIndexOf(","));
        query.append(" from sale ");
        query.append(buildWhereClause(criteria, params));
        if (criteria.dataTableFilter().sorts() != null && !criteria.dataTableFilter().sorts().isEmpty()) {
            query.append(" order by ");
            criteria.dataTableFilter().sorts().forEach(sort -> query.append(sort.column())
                    .append(" ")
                    .append(sort.sortOrder())
                    .append(", "));
            query.deleteCharAt(query.lastIndexOf(","));
        }
        if (!isDataExport) {
            query.append(" limit ")
                    .append(criteria.paginate().pageSize())
                    .append(" offset ")
                    .append(criteria.paginate().offset());
        }
        return query.toString();
    }

    @SuppressWarnings("unchecked")
    private String buildWhereClause(Criteria criteria, Map<String, Object> params) {
        if (criteria.dataTableFilter().filters().isEmpty()) {
            return "";
        }
        StringBuilder sql = new StringBuilder();
        sql.append(" where ");

        criteria.dataTableFilter().filters().forEach(filter -> {
            sql.append(" ( ");
            var queryAndParams = FilterUtil.buildColumnFilterAndParams(filter.columnFilters(), filter.column(), filter.operator());
            sql.append(queryAndParams.get("query")).append(" and ");
            params.putAll((Map<String, Object>) queryAndParams.get("params"));
            sql.append(" ) ");
        });
        var lastIndex = sql.lastIndexOf("and");
        sql.replace(lastIndex, lastIndex + 3, "");
        return sql.toString();
    }
}
