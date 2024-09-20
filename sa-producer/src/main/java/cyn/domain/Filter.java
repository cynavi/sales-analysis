package cyn.domain;

import java.util.List;

public record Filter(
        List<String> columns,
        List<Sort> sorts) {
}
