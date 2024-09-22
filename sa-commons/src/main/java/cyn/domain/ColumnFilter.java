package cyn.domain;

public record ColumnFilter(
        String value,
        MatchMode matchMode
) {
}
