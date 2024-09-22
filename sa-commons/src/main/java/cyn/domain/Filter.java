package cyn.domain;

import java.util.List;

public record Filter(
        String column,
        Operator operator,
        List<ColumnFilter> columnFilters
) {
}
