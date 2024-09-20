package cyn.domain;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record Filter(
        @NotEmpty
        List<@NotNull String> columns,
        List<Sort> sorts,
        List<ColumnFilter> columnFilters
) {
}
