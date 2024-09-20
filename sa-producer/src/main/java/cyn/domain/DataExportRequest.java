package cyn.domain;

import java.util.List;

public record DataExportRequest(
        String id,
        List<String> columns,
        List<Sort> sorts
) {
}
