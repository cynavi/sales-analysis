package cyn.config;

import cyn.entity.Sale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemProcessor;

public class SaleProcessor implements ItemProcessor<Sale, Sale> {

    private static final Logger logger = LoggerFactory.getLogger(SaleProcessor.class);

    @Override
    public Sale process(Sale item) throws Exception {
        logger.info("Processing online retail sale: {}", item);
        return item;
    }
}
