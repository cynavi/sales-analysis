package cyn.repository;

import cyn.domain.SaleOverallFilter;
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

    private static final String overallSalesQuery = """
            select country_code as code, sum(unit_price) as totalSales
            from sale
            where invoice_date >= :from and invoice_date <= :to
            group by country_code
            """;

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

    public List<Map<String, Object>> getSalesOverall(SaleOverallFilter saleOverallFilter) {
        return jdbcTemplate.query(overallSalesQuery,
                Map.of("from", saleOverallFilter.from(), "to", saleOverallFilter.to()),
                (rs, i) -> Map.of("countryCode", rs.getString(1), "totalSales", rs.getDouble(2))
        );
    }

    public Integer getRecordCount() {
        return jdbcTemplate.queryForObject("select count(*) as recordCount from sale", Collections.emptyMap(), Integer.class);
    }
}
