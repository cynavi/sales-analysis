package cyn.domain;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum SortOrder {
    ASC("asc"), DESC("desc");

    private final String value;

    SortOrder(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @JsonCreator
    public static SortOrder fromValue(String value) {
        for (SortOrder sortOrder : SortOrder.values()) {
            if (sortOrder.value.equals(value)) {
                return sortOrder;
            }
        }
        return null;
    }
}
