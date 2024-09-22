package cyn.domain;

import jakarta.validation.constraints.NotNull;

public record Paginate(
        @NotNull
        Integer pageSize,
        @NotNull
        Integer offset
) {
}
