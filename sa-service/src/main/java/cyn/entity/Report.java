package cyn.entity;

import cyn.domain.Status;
import jakarta.persistence.*;

@Entity
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Enumerated
    Status status;

    String path;

    String query;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}
