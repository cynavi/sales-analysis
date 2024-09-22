package cyn.config;

import cyn.entity.Sale;
import cyn.service.BatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemProcessor;

import java.util.Random;

public class SaleProcessor implements ItemProcessor<Sale, Sale> {

    private static final Logger logger = LoggerFactory.getLogger(SaleProcessor.class);

    private final BatchService batchService;

    public SaleProcessor(BatchService batchService) {
        this.batchService = batchService;
    }

    @Override
    public Sale process(Sale item) throws Exception {
        logger.info("Processing online retail sale: {}", item);
        var countries = batchService.getCountries();
        var countryCode = countries.get(item.getCountry());
        if (null == countryCode) {
            var codes = countries.values().stream().toList();
            int rand = new Random().nextInt(codes.size());
            countryCode = codes.get(rand);
        }
        item.setCountryCode(countryCode);
        return item;
    }
}
