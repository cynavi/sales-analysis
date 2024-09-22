package cyn.config;

import cyn.entity.Sale;
import cyn.service.BatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;

public class DatabaseSaleWriter implements ItemWriter<Sale> {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSaleWriter.class);

    private final BatchService batchService;

    public DatabaseSaleWriter(BatchService batchService) {
        this.batchService = batchService;
    }

    @Override
    public void write(Chunk<? extends Sale> sale) {
        logger.info("Writing sales to database with size {}", sale.size());
        sale.getItems().forEach(this.batchService::save);
    }
}
