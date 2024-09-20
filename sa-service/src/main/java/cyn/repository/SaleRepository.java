package cyn.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class SaleRepository {

    private static final Logger logger = LoggerFactory.getLogger(SaleRepository.class);

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public SaleRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<List<Object>> getSalesCSVData(String query, List<String> columns, Map<String, Object> params) {
        return jdbcTemplate.query(query, params, (rs, i) -> {
            var list = new ArrayList<>();
            columns.forEach(col -> {
                try {
                    list.add(rs.getObject(col));
                } catch (SQLException e) {
                    logger.error("Error while querying db: ", e);
                }
            });
            return list;
        });
    }

    public List<Map<String, Object>> getSalesData(String query, List<String> columns, Map<String, Object> params) {
        return jdbcTemplate.query(query, params, (rs, i) -> {
            var sale = new HashMap<String, Object>();
            columns.forEach(col -> {
                try {
                    sale.put(col, rs.getObject(col));
                } catch (SQLException e) {
                    logger.error("Error while querying db: ", e);
                }
            });
            return sale;
        });
    }

    public Integer getRecordCount() {
        return jdbcTemplate.queryForObject("select count(*) as recordCount from sale", Collections.emptyMap(), Integer.class);
    }
}
