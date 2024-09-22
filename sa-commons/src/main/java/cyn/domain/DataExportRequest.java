package cyn.domain;

public record DataExportRequest(
        String id,
        DataTableFilter dataTableFilter
) {
}
