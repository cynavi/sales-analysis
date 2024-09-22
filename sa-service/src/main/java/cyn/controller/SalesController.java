package cyn.controller;

import cyn.domain.Criteria;
import cyn.domain.Response;
import cyn.domain.SaleOverallFilter;
import cyn.service.SaleService;
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

    private final SaleService saleService;

    public SalesController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping("/sales")
    public ResponseEntity<Mono<Response>> getSalesDate(@Valid @RequestBody Criteria criteria) {
        var response = new Response(saleService.getSalesData(criteria), List.of());
        return ResponseEntity
                .status(HttpStatus.OK.value())
                .body(Mono.just(response));
    }

    @GetMapping("/sales/count")
    public ResponseEntity<Mono<Response>> getRecordCount() {
        return ResponseEntity
                .status(HttpStatus.OK.value())
                .body(Mono.just(new Response(Map.of("recordCount", saleService.getRecordCount()), List.of())));
    }

    @PostMapping("/sales/overall")
    public ResponseEntity<Mono<Response>> getSalesOverall(@Valid @RequestBody SaleOverallFilter saleOverallFilter) {
        return ResponseEntity
                .status(HttpStatus.OK.value())
                .body(Mono.just(new Response(saleService.getOverallSales(saleOverallFilter), List.of())));
    }
}
