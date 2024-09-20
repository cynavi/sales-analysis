package cyn.component;

import cyn.domain.Status;
import cyn.service.ReportService;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Component
@EnableScheduling
public class WebSocketStream {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketStream.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final ReportService reportService;

    public WebSocketStream(SimpMessagingTemplate messagingTemplate, ReportService reportService) {
        this.messagingTemplate = messagingTemplate;
        this.reportService = reportService;
    }

    @Scheduled(fixedRate = 5000)
    public void streamCSVReports() {
        var reports = reportService.findAllReadyJob();
        reports.forEach(report -> {
            File file = new File(report.getPath());
            try {
                logger.info("Streaming report with id {}", report.getId());
                var bytes = FileUtils.readFileToByteArray(file);
                messagingTemplate.convertAndSend("/reports", Map.of("name", report.getId(), "bytes", bytes));
                report.setStatus(Status.COMPLETED);
                reportService.save(report);
            } catch (IOException e) {
                logger.error("Something went wrong try to read csv", e);
            }
        });
    }
}
