package cyn.domain;

import java.util.List;

public record DataExportRequest(
        String id,
        String name,
        List<String> columns,
        List<Sort> sorts
) {
}
