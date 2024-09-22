package cyn.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record Sort(
        @NotBlank
        String column,

        @NotNull
        SortOrder sortOrder
) {
}
