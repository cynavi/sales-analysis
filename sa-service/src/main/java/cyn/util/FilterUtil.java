package cyn.util;

import cyn.domain.ColumnFilter;
import cyn.domain.Operator;

import java.text.MessageFormat;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FilterUtil {

    public static Map<String, Object> buildColumnFilterAndParams(List<ColumnFilter> columnFilters, String column, Operator operator) {
        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder();
        for (int i = 0; i < columnFilters.size(); i++) {
            var cf = columnFilters.get(i);
            String key = column + i;
            query.append(switch (cf.matchMode()) {
                case STARTS_WITH -> {
                    params.put(key, cf.value().toLowerCase() + "%");
                    yield MessageFormat.format(" lower({0}) like :{1}", column, key);
                }
                case CONTAINS -> {
                    params.put(key, "%" + cf.value().toLowerCase() + "%");
                    yield MessageFormat.format(" lower({0}) like :{1}", column, key);
                }
                case NOT_CONTAINS -> {
                    params.put(key, "%" + cf.value().toLowerCase() + "%");
                    yield MessageFormat.format(" lower({0}) not like :{1}", column, key);
                }
                case ENDS_WITH -> {
                    params.put(key, "%" + cf.value().toLowerCase());
                    yield MessageFormat.format(" lower({0}) like :{1}", column, key);
                }
                case EQUALS -> {
                    params.put(key, Integer.parseInt(cf.value()));
                    yield column + " = :" + key;
                }
                case NOT_EQUALS -> {
                    params.put(key, Integer.parseInt(cf.value()));
                    yield column + " != :" + key;
                }
                case LESS_THAN -> {
                    params.put(key, Integer.parseInt(cf.value()));
                    yield column + " < :" + key;
                }
                case LESS_THAN_OR_EQUAL_TO -> {
                    params.put(key, Integer.parseInt(cf.value()));
                    yield column + " <= :" + key;
                }
                case GREATER_THAN -> {
                    params.put(key, Integer.parseInt(cf.value()));
                    yield column + " > :" + key;
                }
                case GREATER_THAN_OR_EQUAL_TO -> {
                    params.put(key, Integer.parseInt(cf.value()));
                    yield column + " >= :" + key;
                }
                case DATE_IS -> {
                    params.put(key, LocalDate.parse(cf.value()));
                    yield column + " = :" + key;
                }
                case DATE_IS_NOT -> {
                    params.put(key, LocalDate.parse(cf.value()));
                    yield column + " != :" + key;
                }
                case DATE_BEFORE -> {
                    params.put(key, LocalDate.parse(cf.value()));
                    yield column + " <= :" + key;
                }
                case DATE_AFTER -> {
                    params.put(key, LocalDate.parse(cf.value()));
                    yield column + " >= :" + key;
                }
            });
            if (i != columnFilters.size() - 1) {
                query.append(" ").append(operator.name().toLowerCase()).append(" ");
            }
        }
        var queryAndParams = new HashMap<String, Object>();
        queryAndParams.put("query", query.toString());
        queryAndParams.put("params", params);
        return queryAndParams;
    }
}
