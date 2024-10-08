package cyn.config;

import cyn.service.SaleService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.annotation.KafkaListener;

@Configuration
@EnableKafka
public class SalesCSVConsumer {

    private static final Logger logger = LoggerFactory.getLogger(SalesCSVConsumer.class);

    private final SaleService saleService;

    public SalesCSVConsumer(SaleService saleService) {
        this.saleService = saleService;
    }

    @KafkaListener(topics = "sa-csv", groupId = "sa-csv-group")
    public void onMessage(ConsumerRecord<String, String> consumerRecord) {
        logger.info("Got sales csv request: {}", consumerRecord);
        saleService.processCSVRequest(consumerRecord);
    }
}
