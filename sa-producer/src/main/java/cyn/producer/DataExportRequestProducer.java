package cyn.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cyn.domain.DataExportRequest;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataExportRequestProducer {

    private static final Logger logger = LoggerFactory.getLogger(DataExportRequestProducer.class);
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    @Value("${spring.kafka.topic.csv}")
    private String topic;

    public DataExportRequestProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendDataExportRequestEvent(DataExportRequest dataExportRequest) throws JsonProcessingException {
        var key = dataExportRequest.id();
        var value = objectMapper.writeValueAsString(dataExportRequest);
        var producerRecord = new ProducerRecord<>(topic, null, key, value, List.of(new RecordHeader("event-source", "scanner".getBytes())));
        kafkaTemplate.send(producerRecord)
                .whenComplete((sendResult, throwable) -> {
                    if (throwable != null) {
                        logger.error("Unable to send message: {}", throwable.getMessage());
                    } else {
                        logger.info("Message Sent SuccessFully for the key : {} and the value is {} , partition is {}",
                                key, value, sendResult.getRecordMetadata().partition());
                    }
                });
    }
}
