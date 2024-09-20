package cyn.domain;

import jakarta.validation.constraints.NotNull;

public record Criteria(
        @NotNull
        Filter filter,
        @NotNull
        Paginate paginate
) {
}
