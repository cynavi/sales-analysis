package cyn;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameter;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDateTime;

@SpringBootApplication
public class SalesAnalysisBatchProcessorApplication implements CommandLineRunner {

    @Autowired
    @Qualifier("excelToDatabaseJob")
    private Job job;

    @Autowired
    private JobLauncher jobLauncher;

    public static void main(String[] args) {
        SpringApplication.run(SalesAnalysisBatchProcessorApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        var jobParameters = new JobParametersBuilder()
                .addJobParameter("currentTimestamp", new JobParameter<>(LocalDateTime.now(), LocalDateTime.class))
                .toJobParameters();
        jobLauncher.run(job, jobParameters);
    }
}
