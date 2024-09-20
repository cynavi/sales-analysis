package cyn.controller;

import cyn.domain.Response;
import cyn.service.ColumnService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@CrossOrigin("*")
public class ColumnController {

    private final ColumnService columnService;

    public ColumnController(ColumnService columnService) {
        this.columnService = columnService;
    }

    @GetMapping("/columns")
    public ResponseEntity<Mono<Response>> getColumns() {
        var response = new Response(this.columnService.getColumns(), List.of());
        return ResponseEntity
                .status(HttpStatus.OK.value())
                .body(Mono.just(response));
    }
}
