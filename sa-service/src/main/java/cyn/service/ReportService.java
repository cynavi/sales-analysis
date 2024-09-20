package cyn.service;

import cyn.entity.Report;
import cyn.domain.Status;
import cyn.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public void save(Report report) {
        reportRepository.save(report);
    }

    public List<Report> findAllReadyJob() {
        return reportRepository.findAllByStatus(Status.READY);
    }
}
