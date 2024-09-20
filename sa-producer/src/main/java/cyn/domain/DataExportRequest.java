package cyn.domain;

public record DataExportRequest(
        String id,
        Filter filter,
        Paginate paginate
) {
}
