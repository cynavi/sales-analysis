package cyn.repository;

import cyn.entity.Report;
import cyn.domain.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, String> {

    List<Report> findAllByStatus(Status status);
}
