package cyn.config;

import cyn.entity.Sale;
import cyn.repository.SaleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;

public class DatabaseSaleWriter implements ItemWriter<Sale> {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSaleWriter.class);

    private final SaleRepository saleRepository;

    public DatabaseSaleWriter(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    @Override
    public void write(Chunk<? extends Sale> sale) throws Exception {
        logger.info("Writing sales to database with size {}", sale.size());
        sale.getItems().forEach(saleRepository::save);
    }
}
