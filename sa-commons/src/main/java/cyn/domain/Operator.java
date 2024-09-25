package cyn.domain;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Operator {

    AND("and"),
    OR("or");


    private final String value;

    Operator(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @JsonCreator
    public static Operator fromValue(String value) {
        for (Operator operator : Operator.values()) {
            if (operator.value.equals(value)) {
                return operator;
            }
        }
        return null;
    }
}
