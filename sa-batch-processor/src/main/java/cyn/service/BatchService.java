package cyn.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import cyn.entity.Sale;
import cyn.repository.BatchRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BatchService {

    private final BatchRepository batchRepository;

    public BatchService(BatchRepository batchRepository) {
        this.batchRepository = batchRepository;
    }

    @Cacheable("countries")
    @SuppressWarnings("unchecked")
    public Map<String, String> getCountries() throws IOException {
        ObjectMapper om = new ObjectMapper();
        ClassPathResource resource = new ClassPathResource("countries.json");
        Map<String, String> country = new HashMap<>();
        List<Map<String, String>> list = om.readValue(new File(resource.getURI()), List.class);
        list.forEach(c -> country.put(c.get("name"), c.get("code")));
        return country;
    }

    public void save(Sale sale) {
        this.batchRepository.save(sale);
    }
}
