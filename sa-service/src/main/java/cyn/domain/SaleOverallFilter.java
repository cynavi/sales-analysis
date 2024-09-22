package cyn.domain;

import jakarta.validation.constraints.NotNull;

import java.util.Date;

public record SaleOverallFilter(
        @NotNull
        Date from,
        @NotNull
        Date to) {
}
