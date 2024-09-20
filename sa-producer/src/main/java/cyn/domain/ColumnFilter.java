package cyn.domain;

public record ColumnFilter(
        String column,
        Operator operator
) {
}
