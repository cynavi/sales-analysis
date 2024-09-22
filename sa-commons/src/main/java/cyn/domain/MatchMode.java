package cyn.domain;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum MatchMode {


    STARTS_WITH("startsWith"),
    CONTAINS("contains"),
    NOT_CONTAINS("notContains"),
    ENDS_WITH("endsWith"),
    EQUALS("equals"),
    NOT_EQUALS("notEquals"),
    //    IN("in"),
    LESS_THAN("lt"),
    LESS_THAN_OR_EQUAL_TO("lte"),
    GREATER_THAN("gt"),
    GREATER_THAN_OR_EQUAL_TO("gte"),
    //    BETWEEN("between"),
//    IS("is"),
//    IS_NOT("isNot"),
//    BEFORE("before"),
//    AFTER("after"),
    DATE_IS("dateIs"),
    DATE_IS_NOT("dateIsNot"),
    DATE_BEFORE("dateBefore"),
    DATE_AFTER("dateAfter");

    private final String value;

    MatchMode(String value) {
        this.value = value;
    }

    // used to define constructors and factory methods as one to use for instantiating new instances of the associated class
    // basically says use enum value while constructing
    @JsonCreator
    public static MatchMode fromValue(String value) {
        for (MatchMode mode : MatchMode.values()) {
            if (mode.value.equals(value)) {
                return mode;
            }
        }
        return null;
    }
}
