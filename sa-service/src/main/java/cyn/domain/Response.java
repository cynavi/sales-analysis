package cyn.domain;

import java.util.List;

public record Response(
        Object data,
        List<Error> errors
) {
}
