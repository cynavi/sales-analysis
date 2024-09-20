package cyn.controller;

import cyn.domain.Criteria;
import cyn.domain.Response;
import cyn.service.SalesService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
public class SalesController {

    private final SalesService salesService;

    public SalesController(SalesService salesService) {
        this.salesService = salesService;
    }

    @PostMapping("/sales")
    public ResponseEntity<Mono<Response>> getSalesDate(@Valid @RequestBody Criteria criteria) {
        var response = new Response(salesService.getSalesData(criteria), List.of());
        return ResponseEntity
                .status(HttpStatus.OK.value())
                .body(Mono.just(response));
    }

    @GetMapping("/sales/count")
    public ResponseEntity<Mono<Response>> getRecordCount() {
        return ResponseEntity
                .status(HttpStatus.OK.value())
                .body(Mono.just(new Response(Map.of("recordCount", salesService.getRecordCount()), List.of())));
    }
}
