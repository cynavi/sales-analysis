package cyn.service;

import cyn.domain.ColumnResponse;
import cyn.entity.Column;
import cyn.repository.ColumnRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColumnService {

    private final ColumnRepository columnRepository;

    public ColumnService(ColumnRepository columnRepository) {
        this.columnRepository = columnRepository;
    }

    public List<ColumnResponse> getColumns() {
        return this.columnRepository.findAll();
    }
}
