package cyn.domain;

import jakarta.validation.constraints.NotNull;

public record Criteria(
        @NotNull
        DataTableFilter dataTableFilter,
        @NotNull
        Paginate paginate
) {
}
