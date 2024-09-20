package cyn.config;

import cyn.entity.Sale;
import cyn.repository.SaleRepository;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.extensions.excel.mapping.BeanWrapperRowMapper;
import org.springframework.batch.extensions.excel.poi.PoiItemReader;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class ExcelToDatabaseJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;

    private final SaleRepository saleRepository;

    public ExcelToDatabaseJobConfig(JobRepository jobRepository,
                                    PlatformTransactionManager transactionManager,
                                    SaleRepository saleRepository) {
        this.jobRepository = jobRepository;
        this.transactionManager = transactionManager;
        this.saleRepository = saleRepository;
    }

    @Bean
    public ItemReader<Sale> reader() {
        var rowMapper = new BeanWrapperRowMapper<Sale>();
        rowMapper.setTargetType(Sale.class);
        var reader = new PoiItemReader<Sale>();
        reader.setLinesToSkip(1);
        reader.setResource(new ClassPathResource("online-retail.xlsx"));
        reader.setRowMapper(rowMapper);
        return reader;
    }

    @Bean
    public Step step1() {
        return new StepBuilder("excelFileToStep1", jobRepository)
                .<Sale, Sale>chunk(1, transactionManager)
                .reader(reader())
                .processor(processor())
                .writer(writer())
                .build();
    }

    @Bean
    public ItemProcessor<Sale, Sale> processor() {
        return new SaleProcessor();
    }

    @Bean
    public ItemWriter<Sale> writer() {
        return new DatabaseSaleWriter(saleRepository);
    }

    @Bean
    public Job excelToDatabaseJob(Step step1) {
        var builder = new JobBuilder("excelToDatabase", jobRepository);
        return builder
                .start(step1)
                .build();
    }
}
