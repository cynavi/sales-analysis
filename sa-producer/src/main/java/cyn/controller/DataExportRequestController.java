package cyn.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import cyn.domain.Criteria;
import cyn.domain.DataExportRequest;
import cyn.producer.DataExportRequestProducer;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
public class DataExportRequestController {

    private final DataExportRequestProducer dataExportRequestProducer;

    public DataExportRequestController(DataExportRequestProducer dataExportRequestProducer) {
        this.dataExportRequestProducer = dataExportRequestProducer;
    }

    @PostMapping("generate")
    public ResponseEntity<Mono<?>> sendDataExportRequest(@RequestBody @Valid Criteria criteria) throws JsonProcessingException {
        var dataExportRequest = new DataExportRequest(UUID.randomUUID().toString(), criteria.filter(), criteria.paginate());
        dataExportRequestProducer.sendDataExportRequestEvent(dataExportRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Mono.just(dataExportRequest));
    }

}
