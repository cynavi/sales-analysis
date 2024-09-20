package cyn.repository;

import cyn.domain.ColumnResponse;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ColumnRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public ColumnRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ColumnResponse> findAll() {
        return this.jdbcTemplate.query("select name, label, type from sale_column", (rs, i) -> new ColumnResponse(
                rs.getString("name"),
                rs.getString("label"),
                rs.getString("type")
        ));
    }
}
